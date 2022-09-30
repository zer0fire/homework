import { effect } from "../effect"
import { reactive } from "../reactive"

function createAppAPI(render) {
    // 工厂
    return function createApp(options) {
        // const { data, render, setup, } = options
        return {
            mount(container) {
                return render(options, container)
            }
        }
    }
}
// 平台的元素操作
function createRenderer (nodeOptions = {}) {
    const { querySelector, insert } = nodeOptions

    const render = (options, container) => {
        // 各平台的操作
        const { data, render, setup, } = options

        if (typeof container === 'string' && container.startsWith('#')) {
            const selector = container
            container = querySelector(selector)
        }
        // data 先运行一下，render 也运行，运行完了挂在 mount 的参数上
        const ctx = {}
        if (setup) {
            // setup 已经处理完了
            ctx.setup = setup()
        }
        if (data) {
            ctx.data = reactive(data())
        }
        const proxy = new Proxy(ctx, {
            get(target, key) {
                if (target.setup && target.setup[key] !== undefined) {
                    return target.setup[key]
                } else if (target.data && target.data[key] !== undefined) {
                    return target.data[key]
                }
            },
            set(target, key, value) {
                if (target.setup && target.setup[key] !== undefined) {
                    return target.setup[key] = value
                } else if (target.data && target.data[key] !== undefined) {
                    return target.data[key] = value
                }
            }
        })

        function update() {
            // diff -> mount / updateNode
            container.innerHTML = '' // clear // updateNode
            const node = render.call(proxy)
            insert(container, node)
        }

        effect(update)
        return proxy
    }
    const createApp = createAppAPI(render)
    return {
        render,
        createApp
    }
}

export { 
    createRenderer,
    createAppAPI
}