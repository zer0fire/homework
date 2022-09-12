describe('scope', () => {
    // const a = '1'
    // function c() {
    //     const b = 2
    // }
    const Scope = require('../scope')
    const root = new Scope()

    root.add('a')

    const child = new Scope({
        parent: root
    })
    child.add('b')

    const childChild = new Scope({
        parent: child
    })
    childChild.add('c')
    test('scope1', () => {
        expect(child.findDefiningScope('a')).toBe(root)
        expect(child.contains('a')).toEqual(true)

        expect(child.findDefiningScope('b')).toBe(child)
        expect(child.contains('b')).toEqual(true)

        expect(child.findDefiningScope('c')).toBe(null)
        expect(child.contains('c')).toEqual(false)
    })
    test('Scope 2', () => {
        expect(childChild.findDefiningScope('b')).toBe(child)
        expect(childChild.contains('b')).toEqual(true)

        expect(childChild.findDefiningScope('a')).toBe(root)
        expect(childChild.contains('a')).toEqual(true)})
})