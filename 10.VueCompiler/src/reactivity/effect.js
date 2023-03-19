export const activeEffect = [];
export function effect(fn) {
  const effectFn = () => {
    fn();
  };
  //  activeEffect 桥梁
  activeEffect.push(effectFn);
  //   activeEffect 先保存，然后 track 读取栈顶，执行完 pop 就可以解决嵌套问题了
  //   利用栈的特性
  //   effectFn 执行的同时，会 get -> Map -> addSet -> reSet -> run
  effectFn();
  activeEffect.pop(effectFn);
}
