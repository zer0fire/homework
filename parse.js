// {
//   "A": 1,
//   "B": 2
// }

const jsonStr = `
{
  "A": 1,
  "B": "string",
  "C": true,
  "G": false,
  "D": {
    "E": null
  }
}
`
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
        while(str[index] !== ',') {
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
        tokens.push({ type: 'null' })
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


[
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
      "type": "number",
      "value": 1
  },
  {
      "type": "comma"
  },
  {
      "type": "string",
      "value": "B"
  },
  {
      "type": "bridge"
  },
  {
      "type": "string",
      "value": "string"
  },
  {
      "type": "comma"
  },
  {
      "type": "string",
      "value": "C"
  },
  {
      "type": "bridge"
  },
  {
      "type": "boolean",
      "value": true
  },
  {
      "type": "comma"
  },
  {
      "type": "string",
      "value": "G"
  },
  {
      "type": "bridge"
  },
  {
      "type": "boolean",
      "value": false
  },
  {
      "type": "comma"
  },
  {
      "type": "string",
      "value": "D"
  },
  {
      "type": "bridge"
  },
  {
      "type": "start"
  },
  {
      "type": "string",
      "value": "E"
  },
  {
      "type": "bridge"
  },
  {
      "type": "null"
  },
  {
      "type": "end"
  },
  {
      "type": "end"
  }
]

console.log(JSON.stringify(getTokens(jsonStr), null, 4))
