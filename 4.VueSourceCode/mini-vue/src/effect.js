let activeEffect;
const effectStack = [];

function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn;
    effectStack.push(effectFn);
    fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  };
  effectFn();
}

export { activeEffect, effect };
