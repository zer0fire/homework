const statePrefix = []

function walk(ast, { enter, leave }) {
    // ast[a][0][b]
    if (typeof ast === 'object') {
        enter(ast)
        for(let key in ast) {
            walk(ast[key], { enter, leave })
        }
        leave(ast)
    }
}

const enter = (node) => {
    if (node && node.type === 'VariableDeclaration' && node.declarations) {
        // console.log(node.declarations)
        // node.declarations.forEach(declare => {
        //     console.log(`${statePrefix.join('')}${declare.id.name}`)
        // })
        console.log(`${statePrefix.join('')}${node.declarations.map(it => it.id.name).join(',')}`)
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



// const a = 0, b = 1;
// if (true) {
//     const c = '123';
// }
// function fn1() {
//     const d = 1
// }
// const e = 3

/**
// =======
// a
// b
// c
// fn1 => d
// e
// =======
 */