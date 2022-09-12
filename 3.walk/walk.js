const statePrefix = []

function walk(ast, { enter, leave }) {
    // ast[a][0][b]
    if (ast && typeof ast === 'object') {
        enter && enter(ast)
        for(let key in ast) {
            walk(ast[key], { enter, leave })
        }
        leave && leave(ast)
    }
}

const enter = (node) => {
    if (node && node.type === 'VariableDeclaration' && node.declarations) {
        // console.log(node.declarations)
        // node.declarations.forEach(declare => {
        //     console.log(`${statePrefix.join('')}${declare.id.name}`)
        // })
        // console.log(`${statePrefix.join('')}${node.declarations.map(it => it.id.name).join(',')}`)
    } else if (node && node.type === 'FunctionDeclaration') {
        // console.log(`${node.id.name} => `)
        // console.log(node)
        statePrefix.push(`${node.id.name} => `)
    }
}
const leave = (node) => {
    if (node && node.type === 'FunctionDeclaration') {
        statePrefix.pop()
    }
}

module.exports = {
    walk,
    enter,
    leave
}
