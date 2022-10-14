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
let taskTimeoutID: number = -1;

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
