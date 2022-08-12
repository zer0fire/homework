let re = /((?:(?:[1-9][0-9]*|0)(?:\.[1-9][0-9]*))|(?:(?:[1-9][0-9]*|0)\.?)|(?:\.[1-9][0-9]*))|(\+)|(-)|(\*)|(\/)|(\s+)|(\()|(\))/g
// let s = '1.1 + 2.2 - 3.31 * 4. / .5  '
// new Regexp
let s = '(5 + 4 + 4 + 5) * 5'


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
      } else if (matched[7]) {
          this.type = '('
      } else if (matched[8]) {
          this.type = ')'
      }
  }
}

let matched
let tokens = []
while (matched = re.exec(s)) {
  if (!matched[6]) {
    tokens.push(new Token(matched))
  }
}
console.log(JSON.stringify(add(tokens), null, 4))

// 1*2+3
// ['1', '*', '2', '+', '3']
function mul(symbols) {
  // <mul>::=<prim>|<mul><mulop><prim>
  // ) 结束符号，返回 mul
  if (symbols.length === 1 || symbols[1].type === ')') {
    // symbols[1]没有
    return symbols.shift();
  } else if (symbols[0].type === 'prim') {
    // symbols[0]
    const mul = {
      type: '*',
      expr: symbols.shift()
    }
    symbols.unshift(mul)
    return symbols.shift()
  } else if (symbols[0].type === "*") {
    symbols.unshift({
      left: symbols.shift(),
      type: symbols.shift().type,
      right: symbols.shift(),
    });
    return mul(symbols)
  } else {
    symbols.unshift(prim(symbols));
    return mul(symbols);
  }
}

// 1+2*3
function add(symbols) {
  // <add>::=<mul>|<add><addop><mul>
  if (symbols.length === 1 || symbols[1].type === ')') {
    // symbols[1]没有
    return symbols.shift();
  } else if (symbols[0].type === '*') {
    const add = {
      type: '+',
      expr: mul(symbols)
    }
    symbols.unshift(add)
    return symbols.shift()
  } else if (symbols[0].type === "+") {
    symbols.unshift({
      left: symbols.shift(),
      type: symbols.shift().type,
      right: mul(symbols),
    });
    return add(symbols);
  } else {
    symbols.unshift(mul(symbols));
    return add(symbols);
  }
}

function prim(symbols) {
  // <prim>::= <leftB><add><rightB>|<real>
  if (symbols[0].type === '(') {
    // 4+4+4
    // 左括号
    symbols.shift()
    let expr = add(symbols)
    // 右括号
    symbols.shift()
    symbols.unshift({
      type: 'prim',
      expr: expr
    })
    return symbols.shift()
  } else if (symbols[0].type === 'num') {
    const prim = {
      type: 'prim',
      expr: symbols.shift()
    }
    symbols.unshift(prim)
    return symbols.shift()
  }
}


// [
//   {
//       "type": "("
//   },
//   {
//       "type": "num",
//       "value": "4"
//   },
//   {
//       "type": "+"
//   },
//   {
//       "type": "num",
//       "value": "4"
//   },
//   {
//       "type": "+"
//   },
//   {
//       "type": "num",
//       "value": "4"
//   },
//   {
//       "type": ")"
//   },
//   {
//       "type": "*"
//   },
//   {
//       "type": "num",
//       "value": "5"
//   },
//   {
//       "type": "*"
//   },
//   {
//       "type": "num",
//       "value": "5"
//   },
//   {
//       "type": "*"
//   },
//   {
//       "type": "num",
//       "value": "5"
//   }
// ]


// 写一个 JSON.parse