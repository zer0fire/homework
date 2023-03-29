/**
 * @flow
 */
import { activeEffect } from "./effect";
const effectsMap = new Map();

function track(target, key) {
  if (activeEffect) {
    let depsMap = effectsMap.get(target);
    if (!depsMap) {
      effectsMap.set(target, (depsMap = new Map()));
    }
    let effects = depsMap.get(key);
    if (!effects) {
      depsMap.set(key, (effects = new Set()));
    }
    // 收集依赖
    effects.add(activeEffect);
  }
}

function trigger(target, key) {
  const deps = effectsMap.get(target);
  if (deps) {
    let effects = deps.get(key);
    effects &&
      effects.forEach((fn) => {
        if (fn.options.scheduler) {
          fn.options.scheduler(fn);
        } else {
          fn && fn();
        }
      });
  }
}

export function reactive(target) {
  // 判断 target 是否是对象
  if (typeof target !== "object" || target === null) {
    return target;
  }
  return new Proxy(target, {
    // 拦截属性的读取
    get(target, key, receiver) {
      // 返回属性值，如果是嵌套对象，递归处理
      const value = reactive(Reflect.get(target, key, receiver));
      track(target, key);
      return value;
    },
    // 拦截属性的修改或添加
    set(target, key, value, receiver) {
      // 设置属性值，返回操作结果
      const ret = Reflect.set(target, key, value, receiver);
      // 触发更新
      trigger(target, key);
      return ret;
    },
    deleteProperty(target, key) {
      // 触发更新
      // 删除属性，返回操作结果
      return Reflect.deleteProperty(target, key);
    },
  });
}
