const Scope = require("./scope")
const { walk } = require('./walk')
const scopeStack = []
const rootScope = new Scope({ name: 'root' })
scopeStack.push(rootScope)
const allScope = []
allScope.push(rootScope)

module.exports = function analysis(ast) {
    walk(ast, {
        enter: (node) => {
            if (node.type === 'VariableDeclaration' && node.declarations) {
                node.declarations.forEach(declare => {
                    scopeStack[scopeStack.length - 1].add(declare.id.name)
                })
            } else if (
                node.type === 'FunctionDeclaration'
                || node.type === 'ArrowFunctionExpression'
                || node.type === 'IfStatement'
                || node.type === 'ForStatement'
            ) {
                // console.log(`${node.id.name} => `)
                // console.log(node)
                const parent = scopeStack[scopeStack.length - 1]
                const childScope = new Scope({
                    name: node,
                    parent
                })
                // parent.children.push(funcScope)
                scopeStack.push(childScope)
                allScope.push(childScope)
            }
        },
        leave: (node) => {
            if (
                node.type === 'FunctionDeclaration'
                || node.type === 'ArrowFunctionExpression'
                || node.type === 'IfStatement'
                || node.type === 'ForStatement'
            ) {
                scopeStack.pop()
            }
        }
    })
    return {
        root: scopeStack[0],
        allScope
    }
}

// 任何情况，const let var func if for while 等都对、
// 写个 10 多个
// 什么时候创建，什么时候退回
// bundle，引入的情况
// tree shaking 的