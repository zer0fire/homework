// {
//   "A": 1,
//   "B": 2
// }

// JSON.parse

// (\s+) 所有空格，比如 \n，比如空格
// let re = /(\s+)|(?:(?:[1-9][0-9]*|0)(?:\.[1-9][0-9]*))|(?:(?:[1-9][0-9]*|0)\.?)|(?:\.[1-9][0-9]*))|(".*")|(\,)|(\:)|(\[)|(\])|(\{)|(\})|(true)|(false)|(null)/g

// getTokens 获得的 token
// 制定一个规则，把 parse 的 token 组装起来，k-v 一对放到对象里
// object 栈，栈顶放入一个对象，object[key] = value




/** bnf
<object>::="{"(<whitespace><string><whitespace>":"<whitespace><json>(","<string><whitespace>":"<whitespace><json>)*)?"}"
<array>::="["(<json>(","<json>)*)?"]"
<boolean>::="true"|"false"
<string>
<number>
<whitespace>::=" "|"\n"
<json>::=<whitespace>(<string>|<number>|<object>|<array>|<boolean>|"null")<whitespace>

**/




/**
 * 
 * @param {string} str 
 * @returns tokens
 */
function getTokens(str) {
  let index = 0
  const tokens = []
  while(index < str.length) {
    switch(str[index]) {
      case '"': 
        index++
        let strCache = ''
        while(str[index] !== '"') {
          strCache += str[index]
          index++
        }
        tokens.push({ type: 'string', value: strCache })
        index++
        break;
      case "{": 
        tokens.push({ type: 'start' })
        index++
        break;
      case '}': 
        tokens.push({ type: 'end' })
        index++
        break;
      case '[':
        tokens.push({ type: 'arrayStart' })
        index++
        break;
      case ']':
        tokens.push({ type: 'arrayEnd' })
        index++
        break;
      case ':': 
        tokens.push({ type: 'bridge' })
        index++
        break;
      case ',':
        tokens.push({ type: 'comma' })
        index++
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "0":
        let numCache = ''
        while(str[index] !== ',' && str[index] !== '\n') {
          numCache += str[index]
          index++
        }
        tokens.push({ type: 'number', value: Number(numCache) })
        break;
      case "t": 
        tokens.push({ type: 'boolean', value: true })
        index += 4
        break
      case "f":
        tokens.push({ type: 'boolean', value: false })
        index += 5
        break;
      case "n":
        tokens.push({ type: 'null', value: null})
        index += 4
        break;
      case " ":
      case "\n":
      default: 
        index++
        break;
    }
  }
  return tokens
}

const tokens = [
  {
      "type": "start"
  },
  {
      "type": "string",
      "value": "A"
  },
  {
      "type": "bridge"
  },
  {
      "type": "start"
  },
  {
      "type": "string",
      "value": "B"
  },
  {
      "type": "bridge"
  },
  {
      "type": "number",
      "value": 1
  },
  {
      "type": "end"
  },
  {
      "type": "end"
  }
]


function parse(tokens) {
  const objectStack = []
  const key = []
  for(let i = 0; i < tokens.length; i++) {
    // 判断是否是 value
    if (
      (tokens[i - 1] && tokens[i - 1].type === 'bridge') 
      || (
        // 过滤 array 里面的 object
        tokens[i].type !== 'end' 
        // 过滤 array 里面的 array
        && tokens[i].type !== 'arrayEnd'
        // 过滤 comma
        && tokens[i].type !== 'comma'
        && objectStack[objectStack.length - 1] instanceof Array
    )) {
      // value
      console.log('========value', tokens[i])
      const topObj = objectStack[objectStack.length - 1]
      let value
      if (tokens[i].type === 'start') {
        // value 是 object
        console.log('========start', tokens[i])
        const obj = {}
        objectStack.push(obj)
        value = obj
      } else if (tokens[i].type === 'arrayStart') {
        // value 是 object
        console.log('=======arrayStart', tokens[i])
        const arr = []
        objectStack.push(arr)
        value = arr 
      } else {
        // value 是非引用值
        value = tokens[i].value
        // console.log(tokens[i])
        if (tokens[i + 1].type !== 'comma' && tokens[i + 1].type !== 'end' && tokens[i + 1].type !== 'arrayEnd') {
          throw Error(`unexpected token ${JSON.stringify(tokens[i + 1])}`)
        }
      }
      // console.log(value)
      if (topObj instanceof Array) {
        topObj.push(value)
      } else {
        const cacheKey = key.pop()
        topObj[cacheKey] = value
      }
    } else if (tokens[i].type === 'start') {
      // object start
      objectStack.push({})
    } else if (tokens[i].type === 'arrayStart') {
      objectStack.push([])
    } else if (tokens[i].type === 'string' && tokens[i+1].type === 'bridge') {
      // key
      key.push(tokens[i].value)
      objectStack[objectStack.length - 1][tokens[i].value] = undefined
    } else if ((tokens[i].type === 'end' || tokens[i].type === 'arrayEnd') && objectStack.length >= 2) {
      // object end
      console.log('======end', tokens[i])
      if (tokens[i + 1].type === 'string') {
        throw Error(`unexpected token ${JSON.stringify(tokens[i + 1])}`)
      }
      objectStack.pop()
    }
  }
  // 栈顶元素取出来
  return objectStack[objectStack.length - 1]
}

const jsonStr = `
{
  "A": 1,
  "B": "string",
  "C": true,
  "G": false,
  "D": {
    "E": null,
    "F": [1, "2"]
  }
}
`

const jsonStr2 = `
  {
    "A": {
      "C": {
        "B": 1
      },
      "D": {
        "E": 1
      }
    }
  }
`

const jsonStr3 = `
  {
    "A": null,
    "B": null
  }
`
const jsonStr4 = `
  {
    "A": {
      "B": 1
    }
  }
`

console.log(JSON.stringify(parse(getTokens(jsonStr)), null, 4))
