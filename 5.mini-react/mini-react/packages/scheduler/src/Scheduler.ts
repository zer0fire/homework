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

let needsPaint = false; // 开关
let frameInterval = 5; //frameYieldMs; 帧间隔，没有对齐帧，需要的话用 requestFrameAnimation
// let schedulePerformWorkUntilDeadline: Function;

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

// 只倒计时一个任务，如果更优先，那么取消掉
// 消除空 task，把过 startTime 的任务放到 taskQueue 里面
// 读秒，把 delay 到期的任务移动到 taskQueue。但是现在没有 delay 。实验的 Transition API 用过
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
// 是否将控制权交还给主线程
function shouldYieldToHost(): boolean {
  // 时间段到了就交还，判定是否到了时间切片的末尾
  const currentTime = getCurrentTime();
  const interval = currentTime - startTime;
  // 定时开始时间减去当前时间，如果大于 frameInterval 5 就要交还，如果小于 frameInterval 5 说明在时间切片
  if (interval < frameInterval) {
    return false;
  } else {
    return true;
  }
}

// 执行 flushWork
function performWorkUntilDeadline() {
  // flushWork === scheduledHostCallback
  if (scheduledHostCallback !== null) {
    const initialTime = getCurrentTime();
    startTime = initialTime;
    // 这里要实现时间切片
    const hasTimeRemaining = true;
    let hasMoreWork;
    try {
      // 通过 flushWork 获取是否有任务
      hasMoreWork = scheduledHostCallback(hasTimeRemaining, initialTime);
    } finally {
      if (hasMoreWork) {
        // 有任务，执行时间段
        schedulePerformWorkUntilDeadline();
      } else {
        // 没有任务，归为 null，跳出 loop
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    }
  } else {
    // workLoop 结束
    isMessageLoopRunning = false;
  }
}

// 通道 1 2，可以分别发布消息和互联，为了开启宏任务
const channel = new MessageChannel();
channel.port1.onmessage = performWorkUntilDeadline;

function schedulePerformWorkUntilDeadline() {
  channel.port2.postMessage(null);
}

// 运行 flushWork，模拟 requestIdleCallback
function requestHostCallback(flushWork: HostCallback) {
  // 过了切片置为 null，切片内执行 workLoop
  scheduledHostCallback = flushWork;
  // 表明 workLoop 执行
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    // 执行红认为
    schedulePerformWorkUntilDeadline();
  }
}

// 作业：多写注释，了解算法，总结文章（掘金发文章）
// workLoop 运行 taskQueue 中的内容
// 给定的时间段里执行任务
// work 指代工作单元，执行 callback
// initialTime 指的是当前时间，防止前置任务过多，导致 currentTime 过期
function workLoop(hasTimeRemaining: boolean, initialTime: number): boolean {
  // const task = peek(taskQueue) as Task;
  // 当前的 task 有可能被取消，比如被弃用的，callback 为 null
  let currentTime = initialTime;
  advanceTimers(currentTime);
  currentTask = peek(taskQueue) as Task;
  while (currentTask) {
    if (
      (!hasTimeRemaining || shouldYieldToHost()) &&
      currentTask.expirationTime > currentTime
    ) {
      break;
    }
    if (isFn(currentTask.callback)) {
      // 不能重复执行 callback。假如 callback 没在切片内完成，需要变为空
      // 防止 callback 执行的时间花费过久，这里的 currentTask.callback 可能会被重新执行
      const callback = currentTask.callback;
      currentTask.callback = null;
      // 执行的任务的优先级，为了更高优先级的task方便打断
      currentPriorityLevel = currentTask.sortIndex;

      // callback 执行之后的返回值，就是任务重新开始的地方，恢复现场的函数
      // 比如 callback 是组件更新，这里可能是异步的
      const continuationCallback = callback();
      // 执行完了，需要更新 currentTime
      currentTime = getCurrentTime();
      if (isFn(continuationCallback)) {
        currentTask.callback = continuationCallback;
        advanceTimers(currentTime);
        return true;
      } else {
        // 如果执行完了，continuationCallback 可能是 null
        // pop(taskQueue) 把 currentTask 从堆里面删掉
        if (peek(taskQueue) === currentTask) {
          pop(taskQueue);
        }
        advanceTimers(currentTime);
      }
    } else {
      pop(taskQueue);
    }
    currentTask = peek(taskQueue) as Task;
  }
  if (currentTask) {
    return true;
  } else {
    // 继续，如果没有 taskQueue ，就去 timerQueue，
    const timer = peek(timerQueue) as Task;
    if (timer) {
      requestHostTimeout(handleTimeout, timer.startTime - currentTime);
    }
    return false;
  }
}

// hasTimeRemaining当前有无剩余时间，initialTime现在的初始时间，不和 currentTime 一致是因为开始时间不一定是 curTime
// flushWork 主要解决了任务冲突。workLoop 的入口，flush to work
const flushWork: HostCallback = (
  hasTimeRemaining: boolean,
  initialTime: number
): boolean => {
  // 暂时释放出来，任务还没执行完成，
  isHostCallbackScheduled = false;
  // 定时的先取消
  if (isHostTimeoutScheduled) {
    cancelHostTimeout();
    isHostTimeoutScheduled = false;
  }

  // isPerformingWork 为了防止重新进入一个 workLoop
  isPerformingWork = true;
  // 记录上一个优先级，方便恢复现场
  const previousPriorityLevel = currentPriorityLevel;

  try {
    return workLoop(hasTimeRemaining, initialTime);
  } finally {
    // 可以进入 flushWork
    currentTask = null;
    // 为了打断优先级之后，恢复优先级
    currentPriorityLevel = previousPriorityLevel;
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
      // 如果一个任务花费时间过久，容易堵塞后面的任务，引入了时间切片机制。走某个时间段内周期性执行任务，把控制权交还给浏览器
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

// react 相关面试题
// react 如何解决卡顿
// 时间切片是什么？
// 作业：写文章，写注释
