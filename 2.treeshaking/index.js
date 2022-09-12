const acorn = require('acorn')
const fs = require('fs')

const MagicString = require('magic-string')

const code = fs.readFileSync('./source.js').toString()
const ast = acorn.parse(code, { ecmaVersion: 7 })

const variableDeclaration = []
const expressionStatement = []

const declarations = {}
const statements = []

const m = new MagicString(code)

// console.log({
//   m,
//   ast: JSON.stringify(ast, null, 4)
// })

ast.body.map((node, index) => {
  // console.log(node)
  console.log('--------------m', index, m.snip(node.start, node.end).toString())
  if (node.type === 'VariableDeclaration') {
    // variableDeclaration.push(node)
    const key = node.declarations[0].id.name
    const value = node
    declarations[key] = value
  } else if (node.type === 'ExpressionStatement') {
    expressionStatement.push(node)
  }
})
// 分析 编辑 输出
// analyze expend output
console.log(expressionStatement, variableDeclaration)
expressionStatement.map((node, i) => {
  statements.push(declarations[node.expression.callee.name])
  statements.push(node)
  return { node, i }
})


// variableDeclaration.map(node => {
//   console.log(node.declarations[0].id.name)
// })


console.log('---------------output--------------')
statements.map((node, index) => {
  console.log(`---------------m ${index}`, m.snip(node.start, node.end).toString())
})
// console.log(expressionStatement[0].expression.arguments[0].callee.name)


// 当修一个 bug 产生两个 bug 的时候才差不多需要单元测试
// 单元测试可以隔离架构。当有完整的单元测试才能算分层
// 刷完单测视频