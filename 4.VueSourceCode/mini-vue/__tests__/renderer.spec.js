import {createRenderer, createAppAPI} from '../src/renderer'

describe('renderer', () => {
    const div = document.createElement('div')
    div.id = 'app'
    document.body.appendChild(div)
    test('renderer should have two methods', () => {
        const renderer = createRenderer({
            // appendChild
            // querySelector
        })
        expect(typeof renderer.render).toBe('function')
        expect(typeof renderer.createApp).toBe('function')
    })
    test('createApp and mount', () => {
        const mock1 = jest.fn()
        const createApp = createAppAPI(mock1)
        // 可以做两件事
        createApp().mount()
        expect(typeof createApp).toBe('function')
        expect(mock1).toBeCalled()
    })
    test('render can render', () => {
        function insert(parent, child) {
            return parent.appendChild(child)
        }
        function querySelector(str) {
            return document.querySelector(str)
        }
        const renderer = createRenderer({
            querySelector,
            insert
        })

        const div = document.createElement('div')
        const app = renderer.createApp({ 
            data() {
                return {
                    title: 'hello'
                }
            } ,
            render() {
                const el = document.createTextNode(this.title)
                return el
            }
        }).mount(div)
        expect(div.innerHTML).toBe('hello')
        expect(app.title).toBe('hello')
    })
    test('render can render', () => {
        function insert(parent, child) {
            return parent.appendChild(child)
        }
        function querySelector(str) {
            return document.querySelector(str)
        }
        const renderer = createRenderer({
            querySelector,
            insert
        })

        const div = document.createElement('div')
        const app = renderer.createApp({ 
            data() {
                return {
                    title: 'hello'
                }
            } ,
            render() {
                const el = document.createTextNode(this.title)
                return el
            }
        }).mount(div)
        expect(div.innerHTML).toBe('hello')

        app.title = 'reactive'
        expect(div.innerHTML).toBe('reactive')
        expect(app.title).toBe('reactive')
    })
})

// 作业：mount 的返回是什么？，返回一个可以读取 data 结果的对象 app
// app.title = 'mini-vue, hello'
// app.title 的 reactivity