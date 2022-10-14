import {push, pop, peek} from "./SchedulerMinHeap";
import {getCurrentTime, isFn, isObject} from "./shared";
import {getTimeoutByPriorityLevel, NormalPriority} from "./SchedulerPriorities";

type Callback = any; // (args: any) => void | any;

export interface Task {
  id: number;
  callback: Callback;
  priorityLevel: number;
  startTime: number;
  expirationTime: number;
  sortIndex: number;
}

type HostCallback = (hasTimeRemaining: boolean, currentTime: number) => boolean;

// 任务存储，最小堆
// 立马要执行的任务
const taskQueue: Array<Task> = [];
// 延期的任务
const timerQueue: Array<Task> = [];

let taskIdCounter: number = 1;

let currentTask: Task | null = null;
let currentPriorityLevel = NormalPriority;

// 在计时
let isHostTimeoutScheduled: boolean = false;

// 在调度任务
let isHostCallbackScheduled = false;

let isMessageLoopRunning = false;
let scheduledHostCallback: HostCallback | null = null;
let taskTimeoutID: number | NodeJS.Timeout = -1;

let startTime = -1;

let needsPaint = false;
let frameInterval = 5; //frameYieldMs;

function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime;
  if (timeElapsed < frameInterval) {
    // The main thread has only been blocked for a really short amount of time;
    // smaller than a single frame. Don't yield yet.
    return false;
  }

  return true;
}

let schedulePerformWorkUntilDeadline: Function;

// This is set while performing work, to prevent re-entrance.
let isPerformingWork = false;

function workLoop(hasTimeRemaining: boolean, initialTime: number) {
  let currentTime = initialTime;
  advanceTimers(currentTime);
  currentTask = peek(taskQueue) as Task;

  while (currentTask !== null) {
    if (
      currentTask.expirationTime > currentTime &&
      !(hasTimeRemaining || shouldYieldToHost())
    ) {
      // This currentTask hasn't expired, and we've reached the deadline.
      //  当前任务还没有过期
      break;
    }
    const callback = currentTask.callback;
    if (isFn(callback)) {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;

      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();
      if (isFn(continuationCallback)) {
        currentTask.callback = continuationCallback;
      } else {
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }
      advanceTimers(currentTime);
    } else {
      pop(taskQueue);
    }

    currentTask = peek(taskQueue) as Task;
  }

  // Return whether there's additional work
  if (currentTask !== null) {
    return true;
  } else {
    const firstTimer = peek(timerQueue) as Task;
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    return false;
  }
}

function flushWork(hasTimeRemaining: boolean, initialTime: number) {
  isHostCallbackScheduled = false;

  if (isHostTimeoutScheduled) {
    // We scheduled a timeout but it's no longer needed. Cancel it.
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  isPerformingWork = true;

  const previousPriorityLevel = currentPriorityLevel;

  try {
    return workLoop(hasTimeRemaining, initialTime);
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
  }
}

function requestHostTimeout(callback: Callback, ms: number) {
  taskTimeoutID = setTimeout(() => {
    callback(getCurrentTime());
  }, ms);
}

function cancelHostTimeout() {
  clearTimeout(taskTimeoutID)
  taskTimeoutID = -1
}

function requestHostCallback(callback: HostCallback) {
  scheduledHostCallback = callback
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true
    schedulePerformWorkUntilDeadline()
  }
}

function advanceTimers(currentTime: number) {
  let timer = peek(timerQueue) as Task
  while(timer) {
    if (timer.callback === null) {
      pop(timerQueue)
    } else if (timer.startTime < currentTime) {
      timer.sortIndex = timer.expirationTime
      push(taskQueue, timer)
      pop(timerQueue)
    } else {
      break
    }
    timer = peek(timerQueue) as Task
  }
}

function handleTimeout(currentTime: number) {
  isHostTimeoutScheduled = false
  advanceTimers(currentTime)
  if (!isHostCallbackScheduled) {
    if (peek(taskQueue)) {
      isHostCallbackScheduled = true
      requestHostCallback(flushWork)
    } else {
      // 没有非定时任务
      // 
      let timer = peek(timerQueue) as Task
      if (timer) {
        requestHostTimeout(handleTimeout, timer.startTime - currentTime)
      }
    }
  }
}

// input: callback，让 callback 能够按照 priorityLevel 和 delay 执行
export function scheduleCallback(priorityLevel: number, callback: () => {}, options?: { delay?: number }) {
    const currentTime = getCurrentTime()
    let startTime = currentTime
    if (options && options.delay) {
      startTime = currentTime + options.delay
    }

    const timeout = getTimeoutByPriorityLevel(priorityLevel)
    const expirationTime = startTime + timeout

    let sortIndex = -1

    const task: Task = {
        id: taskIdCounter++,
        callback,
        startTime,
        expirationTime,
        priorityLevel,
        sortIndex
    }

    if (startTime > currentTime) {
      task.sortIndex = startTime
      push(timerQueue, task)

      if (!peek(taskQueue) && task === peek(timerQueue)) {
        if (isHostTimeoutScheduled) {
          cancelHostTimeout()
        } else {
          isHostTimeoutScheduled = true
        }
        requestHostTimeout(handleTimeout, startTime - currentTime)
      }
    } else {
      task.sortIndex = expirationTime
      push(taskQueue, task)
    }
}
