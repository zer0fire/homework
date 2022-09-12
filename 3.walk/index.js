// fs.read
// parse
// walk
// scope
//// 每个变量都要放到 current scope，
//// 每一层层级函数是 scope 都放到 scope 栈内，
//// currentScope 是栈顶


const acorn = require('acorn')
const fs = require('fs')
const { walk } = require('./walk')

const code = fs.readFileSync('./source.js').toString()
const ast = acorn.parse(code, { ecmaVersion: 7 })
const Scope = require('./scope')

const scopeStack = []
const rootScope = new Scope({ name: 'root' })
scopeStack.push(rootScope)

const enter = (node) => {
    if (node && node.type === 'VariableDeclaration' && node.declarations) {
        // console.log(node.declarations)
        // node.declarations.forEach(declare => {
        //     console.log(`${scopeStack.join('')}${declare.id.name}`)
        // })
        console.log(`${node.declarations.map(it => it.id.name).join(',')}`)
    } else if (node && node.type === 'FunctionDeclaration') {
        // console.log(`${node.id.name} => `)
        // console.log(node)
        scopeStack.push(new Scope({
            name: node.id.name,
            parent: scopeStack[scopeStack.length - 1]
        }))
    }
}
const leave = (node) => {
    if (node && node.type === 'FunctionDeclaration') {
        scopeStack.pop()
    }
}

walk(ast, { enter, leave })


