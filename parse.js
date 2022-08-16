// {
//   "A": 1,
//   "B": 2
// }


`
{
  "A": 1,
  "B": 2
}
`

let token = []
/**
 * 
 * @param {string} str 
 */
const global = {
  index: 0
}
const stack = []
function parse(str) {
  
  for(; index < str.length;) {
    switcher(str[index])
  }
}


function switcher(char) {
  switch (char) {
    case '{':
      break;
    case '}': 
      break;
    case '"': 
      if (stack.length) {
        state = 'keyStart'
      } else {
        k = stack.join()
      }
      break;
    case ':':
      state = 'value'
      break;
    case ',':
      break;
    case '': break;
    default: 
  }
  global.index++
}


console.log(JSON.parse(JSON.stringify(a)))
