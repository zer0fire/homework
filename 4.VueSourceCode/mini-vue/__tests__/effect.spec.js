import {effect} from '../src/effect'
import { reactive } from '../src/reactive'

describe('effect', () => {
    test('effect', () => {
        const obj = {
            foo: 'foo'
        }
        const react = reactive(obj)
        let custom

        const mock1 = jest.fn(() => {
            custom = react.foo
        })
        effect(mock1)
        expect(mock1).toHaveBeenCalledTimes(1)

        react.foo = 'yyy'
        // expect(mock1).toHaveBeenCalledTimes(2)
        expect(custom).toBe('yyy')
    })
    test('effect', () => {
        const obj = {
            num1: 1,
            num2: 2
        }
        const react = reactive(obj)

        let dummy
        effect(() => {
            dummy = react.num1 + react.num2
        })
        expect(dummy).toBe(3)
        react.num1 = 5
        react.num2 = 6
        expect(dummy).toBe(11)
    })
    test('effect', () => {
        const obj = {
            num1: 1,
            num2: 2
        }
        const react = reactive(obj)

        let dummy1
        let dummy2
        effect(() => {
            dummy1 = react.num1
        })
        effect(() => {
            dummy2 = react.num2
        })
        expect(dummy1).toBe(1)
        expect(dummy2).toBe(2)
    })
    it('effect should linked to exactly key', () => {
        const observe = reactive({ foo: 'foo', bar: 'bar' })
        const fnSpy = jest.fn(() => {
            observe.foo
        })
        effect(fnSpy)
        observe.bar = 'barrr'
        observe.foo = 'foooo'
        expect(fnSpy).toHaveBeenCalledTimes(2)
    })
})
// 1. effect 嵌套怎么解决
// 2. 响应式对象更新映射，key 和 effect 之间要关联
// 3. 作业：响应式对象的属性和副作用绑定，访问指定属性才能调用对应的 effect