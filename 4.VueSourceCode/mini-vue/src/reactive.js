import { activeEffect } from "./effect"
const effectMap = new WeakMap()
export function reactive(obj) {
    // Object.defineProperty
    return new Proxy(obj, {
        get(target, key) {
            let depsMap = effectMap.get(target)
            if (!depsMap) {
                effectMap.set(target, (depsMap = new Map()))
            }
            let deps = depsMap.get(key)
            if (!deps) {
                deps.set(key, deps = new Set())
            }
            deps.add(activeEffect)
            return Reflect.get(target, key)
        },
        set(target, key, value) {
            const res = Reflect.set(target, key, value)
            effectArr.forEach(fn => {
                fn && fn()
            })
            return res
        },
        deleteProperty(target, key) {
            const res = Reflect.deleteProperty(target, key)
            effectArr.forEach(fn => {
                fn && fn()
            })
            return res
        }
    })
    // return Object.create({}, obj)
}