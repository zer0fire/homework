
function innerAppend(parent, child) {
    return parent.appendChild(child)
}

export function createApp(options = {}) {
    const { data, render, setup, } = options

    return {
        /**
         * 
         * @param {Document | String} container 
         * @returns 
         */
        mount(container) {
            if (typeof container === 'string' && container.startsWith('#')) {
                const selector = container
                container = document.querySelector(selector)
            }
            // data 先运行一下，render 也运行，运行完了挂在 mount 的参数上
            const ctx = {}
            if (setup) {
                ctx.setup = setup()
            }
            if (data) {
                ctx.data = data()
            }
            const proxy = new Proxy(ctx, {
                get(target, key) {
                    if (target.setup && target.setup[key]) {
                        return target.setup[key]
                    } else if (target.data && target.data[key]) {
                        return target.data[key]
                    }
                    // else {
                    //     // computer
                    //     // inject
                    //     // prop
                    // }
                }
            })

            const node = render.call(proxy)
            innerAppend(container, node)
            return proxy
        }
    }
}