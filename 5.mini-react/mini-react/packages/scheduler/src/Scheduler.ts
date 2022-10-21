import { push, pop, peek } from "./SchedulerMinHeap";
import { getCurrentTime, isFn, isObject } from "./shared";
import {
  getTimeoutByPriorityLevel,
  NormalPriority,
} from "./SchedulerPriorities";

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

// 如果不能同时立即执行所有任务，就需要任务存储的任务池
// 是个最小堆
// 任务之间是有优先级的，紧急更新和非紧急更新，比如 input 和下拉框
// 定义两个任务池，类型不同
// 立马要执行的任务，startTime 小于当前时间的任务（比如最优先的任务 -1）
const taskQueue: Array<Task> = [];
// 延迟执行的任务，没有 start 开始的任务
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
let schedulePerformWorkUntilDeadline: Function;

// This is set while performing work, to prevent re-entrance.
let isPerformingWork = false;

// setTimeout
function requestHostTimeout(callback: Callback, ms: number) {
  taskTimeoutID = setTimeout(() => {
    // 传输 currentTime，到 handleTimeout 里
    callback(getCurrentTime());
  }, ms);
}

// clearTimeout
function cancelHostTimeout() {
  clearTimeout(taskTimeoutID);
  taskTimeoutID = -1;
}

// 消除空 task，把过 startTime 的任务放到 taskQueue 里面
function advanceTimers(currentTime: number) {
  let timer = peek(timerQueue) as Task;
  while (timer) {
    // newTask 里面都有 callback，取消任务可能导致 callback 为 null，因此需要抛出
    if (timer.callback === null) {
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      // 已经 start，开始转到 taskQueue
      const task = pop(timerQueue);
      task.sortIndex = timer.expirationTime;
      push(taskQueue, task);
    } else {
      // 最小堆中最小的也没有任务过期，什么都不用做
      return;
    }
    timer = peek(timerQueue) as Task;
  }
}
// TODO:
// 运行 flushWork
function requestHostCallback(flushWork: HostCallback) {
  scheduledHostCallback = flushWork;
  // flushWork()
}
// TODO:
// 作业：多写注释，了解算法，总结文章（掘金发文章）
// workLoop 运行 taskQueue 中的内容
function workLoop(hasTimeRemaining: boolean, initialTime: number): boolean {
  const task = peek(taskQueue);
  while (task) {}
  return false;
}
// TODO:
// hasTimeRemaining当前有无剩余时间，initialTime现在的初始时间，不和 currentTime 一致是因为开始时间不一定是 curTime
// flushWork 主要解决了任务冲突
const flushWork: HostCallback = (
  hasTimeRemaining: boolean,
  initialTime: number
): boolean => {
  // 暂时释放出来，任务还没执行完成，
  isHostCallbackScheduled = false;
  // 定时的先取消
  if (isHostTimeoutScheduled) {
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  // 为了防止重新进入 isPerformingWork
  isPerformingWork = true;

  try {
    return workLoop(hasTimeRemaining, initialTime);
  } finally {
    // 可以进入 flushWork
    isPerformingWork = false;
  }
};

// 接收 currentTime，要从任务池里拿任务
function handleTimeout(currentTime: number) {
  isHostTimeoutScheduled = false;
  // 检查 timerQueue ，
  advanceTimers(currentTime);

  // 如果没有别的任务执行
  if (!isHostCallbackScheduled) {
    if (peek(taskQueue)) {
      // 提醒别的任务，现在有在执行
      isHostCallbackScheduled = true;
      // 这一步开始执行 task.callback()，但是要考虑这个任务如果很庞大呢？早期的 react 没处理，因此优先级更高的任务动不了，会卡
      // 既然一个任务会阻塞，那么就对时间进行切片，在这段时间内执行任务，如果没有执行完，放回去，回到任务池，先运行别的
      // 运行在浏览器上，就和浏览器的帧率有关，这个时间就是一帧的时间，16.666ms （60帧每秒）
      // 现场保留？单链表可以保留当前指针 stack reconciler -> fiber reconciler
      // requestHostCallback(flushWork)
    } else {
      let timer = peek(timerQueue) as Task;
      if (timer) {
        requestHostTimeout(handleTimeout, timer.startTime - currentTime);
      }
    }
  }
}

// 如果是单线程，每次只能处理一个任务
// 和外界交互的函数，调度一个 callback，callback 就是内容和本体；还要接受优先级本身
// 外界想加一个任务，要排个队，登记一下，查看优先级和内容
export function scheduleCallback(
  priorityLevel: number,
  callback: () => void,
  options?: { delay: number }
) {
  // performance.now()
  const currentTime = getCurrentTime();
  // startTime ，需要看是否被延迟了，组合成 startTime
  let startTime = currentTime;
  if (options && options.delay) {
    startTime += options.delay;
  }
  // 获取过期时间，timeout 加上 startTime，timeout 通过优先级获取，优先级高的会先运行，timeout 会短
  const timeout = getTimeoutByPriorityLevel(priorityLevel);
  const expirationTime = startTime + timeout;

  let sortIndex = -1;

  // 定义一个任务
  const newTask = {
    id: taskIdCounter++,
    callback: callback,
    priorityLevel: priorityLevel,
    startTime: startTime,
    expirationTime: expirationTime,
    sortIndex: sortIndex,
  };

  // 大于当前时间，说明还没运行到，放到 timeQueue
  if (startTime > currentTime) {
    // startTime 是加上了 delay 时间，因此 startTime 越小越靠前执行
    // 因为越大越晚开始，要先把小的，靠前的先执行
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);
    if (!peek(taskQueue) && newTask === peek(timerQueue)) {
      // 如果 taskQueue 是空的，说明现在没有要调度的任务，就需要 timeQueue 里的任务执行；
      // 如果 newTask 是在 timeQueue 里优先级最高的，那么就需要放到 setTimeout 里执行，否则就在 timerQueue 中待着吧
      // 这里不写 delay 就是怕 delay 不存在
      // requestHostTimeout(newTask.callback, startTime - currentTime)

      // 为了防止两个任务同时倒计时，以及当前的任务是最高的优先级，因此需要先运行现在的 newTask
      // isHostTimeoutScheduled 会在有上次 setTimeout 的情况下为 true
      if (isHostTimeoutScheduled) {
        // cancel 前一个，isHostTimeoutScheduled 不用管继续沿用，在 handleTimeout 里置为 false
        cancelHostTimeout();
      } else {
        // 如果为 false，直接占位
        isHostTimeoutScheduled = true;
      }
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    // 小于当前时间，说明已经开始运行了，要在 expirationTime 前运行完
    // expirationTime 代表了 timeout + startTime，expirationTime 越小越靠前执行，
    // 因为越大越晚过期，要保证尽量不过期，就要先把过期的先运行了
    // 这里通常进来的也是 -1 即立即执行级别的
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    // 要不要进行调度？如果没有别的任务调度（isHostCallbackScheduled），就直接开始；
    // isPerformingWork 防止重新进入一个任务
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }
}
