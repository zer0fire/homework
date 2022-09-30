let activeEffect

export function effect (fn) {
    activeEffect = fn
    fn()
}

export {
    activeEffect
}