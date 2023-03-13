const supervene = async (poolLimit, array, iteratorFn) => {
  let ret = [];
  const executing = [];
  for (const item of array) {
    // 创建异步任务，用 Promise.resolve 包裹
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    // 保存异步任务
    ret.push(p);
    if (poolLimit <= array.length) {
      // 判断 poolLimit，移除已完成任务
      const e = p.then((val) => {
        // 异步任务拿到 e，可以返回该内容，也可以直接删除
        console.log(val);
        debugger;
        executing.splice(executing.indexOf(e), 1);
      });
      // 保存正在执行的任务
      executing.push(e);
      if (executing.length >= poolLimit) {
        // 等待正在执行的异步任务
        await Promise.race(executing);
      }
    }
  }
  // 运行保存的异步任务
  return Promise.all(ret);
};

const timeout = (i) =>
  new Promise((resolve) => setTimeout(() => resolve(i), i));
await supervene(2, [1000, 5000, 3000, 2000], timeout);
