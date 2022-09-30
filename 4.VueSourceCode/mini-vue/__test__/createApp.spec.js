import {createApp} from '../src/index'

// afterEach(() => {
//     document.body.innerHTML = ''
// });

describe('createApp', () => {
    const div = document.createElement('div')
    div.id = 'app'
    document.body.appendChild(div)
    test('run createApp() should return App instance', () => {
        const app = createApp()
        // app 是个 object，里面有一个 mount 方法
        expect(typeof app).toBe('object')
        expect(typeof app.mount).toBe('function')
    })
    test('mount return a html text', () => {
        // mount 返回 dom，
        const div = document.createElement('div')
        createApp({ 
            data() {
                return {
                    title: 'hello'
                }
            } ,
            render() {
                const el = document.createElement('div')
                el.innerText = this.title
                return el
            }
        }).mount(div)
        expect(div.childNodes[0].innerText).toBe('hello')
    })
    test('mount can use a dom node or use a string selector', () => {
        createApp({ 
            data() {
                return {
                    title: 'hello'
                }
            } ,
            render() {
                const el = document.createElement('div')
                el.innerText = this.title
                return el
            }
        }).mount('#app')

        expect(document.body.children[0].id).toBe('app')
    })
    // 支持 setup 选项，去掉 data，支持 composition api
    test('support setup', () => {
        createApp({ 
            setup() {
                return {
                    title: 'hello'
                }
            },
            render() {
                const el = document.createElement('div')
                el.innerText = this.title
                return el
            }
        }).mount('#app')

        expect(document.body.children[0].id).toBe('app')
    })

    // createApp 返回一个可以读取 data 结果的对象 app
    test('return a object, it can read property', () => {
        const app = createApp({ 
            setup() {
                return {
                    title: 'hello'
                }
            },
            render() {
                const el = document.createElement('div')
                el.innerText = this.title
                return el
            },
            // setup(props, { slots, attrs, emit, expose }) {
            //     // slot 插槽
            //     // attr 特性
            //     // expose 决定暴露的属性
            // },
            expose: []
        }).mount('#app')
        expect(app.title).toBe('hello')
    })
})

// 作业：mount 的返回是什么？，返回一个可以读取 data 结果的对象 app
// app.title = 'mini-vue, hello'
// app.title 的 reactivity