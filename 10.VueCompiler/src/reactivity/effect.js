export const effectStack = [];
export let activeEffect;
export function effect(fn, options = {}) {
  // options.scheduler
  const { scheduler, lazy } = options;
  const effectFn = () => {
    fn();
  };
  //  activeEffect 桥梁
  activeEffect = effectFn;
  effectStack.push(effectFn);
  //   activeEffect 先保存，然后 track 读取栈顶，执行完 pop 就可以解决嵌套问题了
  //   利用栈的特性
  //   effectFn 执行的同时，会 get -> Map -> addSet -> reSet -> run

  !lazy && effectFn();
  effectStack.pop();
  activeEffect = effectStack[effectStack.length - 1];
  effectFn.options = options;
}
