export const supervene = async (
  poolLimit: number,
  array: Array<any>,
  iteratorFn: (val: any, array: any) => any
) => {
  let ret: Array<any> = [];
  const executing: Array<any> = [];
  for (const item of array) {
    // 创建异步任务，用 Promise.resolve 包裹
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    // 保存异步任务
    ret.push(p);
    if (poolLimit <= array.length) {
      // 判断 poolLimit，移除已完成任务
      const e: any = p.then(() => executing.splice(executing.indexOf(e), 1));
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
