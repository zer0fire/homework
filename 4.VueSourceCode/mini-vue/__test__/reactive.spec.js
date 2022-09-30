import {reactive} from '../src/reactive'

describe('reactive', () => {
    test('reactive', () => {
        // jest-snippet jest-runner
        // obj.foo = 'xx'
        const obj = { foo: 'xxx' }
        const react = reactive(obj)
        expect(react).not.toBe(obj)
        expect(react.foo).toEqual(obj.foo)
        react.foo = 'yyy'
        react.bar = 'bar'
        expect(obj.foo).toBe('yyy')
        expect(obj.bar).toBe('bar')

        delete react.bar
        expect(obj.bar).toBe(undefined)
    })
})