// console.log('123123123'.match(/[0-9]{2,3}/))
// console.log(' '.match(/[\s\S]/))


// let strList = [
//   // '1',
//   // '1.2',
//   // '1.',
//   // '.1',
//   // '0.124',
//   '1+2-3*4/5'
// ]



// // let add = /\+/g

// let postP = /^(([1-9][0-9]*|0)\.)$/
// let preP = /^(\.[1-9][0-9]*)$/
// let middleP = /^(([1-9][0-9]*|0)(\.[1-9][0-9]*)?)$/

// let yang = /^([1-9][0-9]*|[0])(\.[0-9]+)|(\.[0-9]+)|([0-9]\.)?$/
// 会有空字符

// console.log(strList.map(it => {
//   const res = re.exec(it)
//   if (res) {
//     return res[0]
//   }
// }))


class Token {
  constructor(matched) {
      if (matched[1]) {
          this.type = 'num'
          this.value = matched[1]
      } else if (matched[2]) {
          this.type = '+'
      } else if (matched[3]) {
          this.type = '-'
      } else if (matched[4]) {
          this.type = '*'
      } else if (matched[5]) {
          this.type = '/'
      }
  }
}

let re = /((?:(?:[1-9][0-9]*|0)(?:\.[1-9][0-9]*))|(?:(?:[1-9][0-9]*|0)\.?)|(?:\.[1-9][0-9]*))|(\+)|(-)|(\*)|(\/)|(\s+)/g
// let s = '1.1 + 2.2 - 3.31 * 4. / .5  '

let s = '3.31 * 4. / .5'

let matched
let tokens = []
while (matched = re.exec(s)) {
  if (!matched[6]) {
    tokens.push(new Token(matched))
  }
}
console.log(tokens)
// add=mul
// add=add+mul
// mul=number*mul
// mul=number


// let tokens = []
// function add(tokens) {
//   if(tokens[1]) {
      
//   }
// }

// function mul(tokens) {
//   if (!tokens[1]) {
//     return {
//       type: 'number'
//     }
//   } else if (tokens[1].type === "mul" || tokens[1].type === 'div') {
//     return {
//       left: tokens[0],
//       right: mul(tokens.slice(2)),
//       operator: tokens[1].type
//     }
//   } else if (tokens[1].type === "add" || tokens[1].type === 'sub') {
//     return undefined
//   }
//   throw new Error('undefined')
// }

// mul=number
// 右结合的
function mul(tokens) {
  if (tokens[0] === 'number') {
    const num = tokens.shift()
    tokens.unshift({ value: "num", type: 'mul' })
    return mul(tokens)
  } else if (!tokens[1]) {
    return tokens[0]
  } else if (tokens[0] === 'mul') {
    const left = tokens.shift()
    const op = tokens.shift()
    const right = tokens.shift()
    tokens.unshift({
      left, right, op
    })
    return mul(tokens)
  } else if (tokens[1].type === '*' || tokens[1].type === '/') {
    return {
      left: tokens[0],
      right: mul(tokens.slice(2)),
      op: tokens[1].type
    }
  }
}
// mul=number*mul
// 左结合的
function mul (tokens) {
  // 第一个一定是number
  if (tokens[0].type === 'number') {
      const num = tokens.shift()
      tokens.unshift({type:'mul', value:num})
      return mul(tokens)
      // 处理第二个没有值的情况，那么第一个一定是number
  } else if (!tokens[1]) {
      return tokens[0]
  } else if (tokens[0].type === 'mul') {
      const left = tokens.shift()
      const op = tokens.shift()
      const right = tokens.shift()
      tokens.unshift({
        left,
        right,
        op
      })
      return mul(tokens)
  } else if (tokens[1].type === '*' || tokens[1].type === '/') {
      return {
        left:tokens[0],
        right:mul(tokens.slice(2)),
        op:tokens[1].type
      }
  }
}

console.log(JSON.stringify(mul(tokens), null, '    '))


// 加减法
// <number>
// <+>
