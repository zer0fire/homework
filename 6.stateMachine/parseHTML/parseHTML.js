const EOF = Symbol("EOF");

/**
 *
 * @param {string} char
 * @returns
 */
function isLowercase(char) {
  const charCode = char.charCodeAt(0);
  return charCode >= "a".charCodeAt(0) && charCode <= "z".charCodeAt(0);
}

/**
 *
 * @param {string} char
 * @returns
 */
function isUppercase(char) {
  const charCode = char.charCodeAt(0);
  return charCode >= "A".charCodeAt(0) && charCode <= "Z".charCodeAt(0);
}

/**
 *
 * @param {string} char
 * @returns
 */
function isAlphabet(char) {
  // return isLowercase(char) || isUppercase(char);
  return char !== "<" && char !== ">";
}

function isSpace(input) {
  return input === " " || input === "\n" || input === "\r";
}

let value = "";
let list = [];

// 输入
/**
 *
 * @param {string} input
 * @returns
 */
function start(input) {
  //   console.log("start");
  if (input === EOF) {
    return success;
  } else if (input === "<") {
    return tagStart;
  } else if (input === " ") {
    return space;
  } else {
    value += input;
    return startTextNode;
  }
}

function startTextNode(input) {
  if (input === EOF) {
    list.push(value);
    value = "";
    return success;
  } else if (input === "<") {
    list.push(value);
    value = "";
    return tagStart;
  } else if (input === " ") {
    return space;
  } else {
    value += input;
    return startTextNode;
  }
}

// tag 前面和后面允许空格
// tagName 前面和中间不允许有空格，后面允许
// text 中间允许空格
function space(input) {
  //   console.log("space");
  if (input === "<") {
    return tagStart;
  } else if (input == " ") {
    return space;
  } else if (input == ">") {
    return tagEnd;
  }
}

function tagStart(input) {
  //   console.log("tagStart");
  if (input === "/") {
    return tagStart;
  } else if (isAlphabet(input)) {
    value += input;
    return startTagName;
  } else {
    return fail;
  }
}

function startTagName(input) {
  //   console.log("tagStartName");
  if (isAlphabet(input)) {
    value += input;
    return startTagName;
  } else if (input === ">") {
    // console.log(input, value);
    list.push(value);
    value = "";
    return start;
  } else if (input === " ") {
    return space;
  } else {
    return fail;
  }
}

// function tagEndStart(input) {
//   if (isAlphabet(input)) {
//     return tagEndName;
//   } else if (input === " ") {
//     return fail;
//   }
// }

// function tagEndName(input) {
//   //   console.log("tagEndName");
//   if (isAlphabet(input)) {
//     return tagEndName;
//   } else if (input === " ") {
//     return tagEndName;
//   } else if (input === ">") {
//     return tagEnd;
//   } else {
//     return fail;
//   }
// }

function tagEnd(input) {
  if (input === EOF) {
    return success;
  } else if (input === "<") {
    return tagStart;
  } else {
    return start;
  }
}

// 结束状态
function success(input) {
  throw new Error("illegal success call");
  // return success;
}

function fail(input) {
  // fail 的时候，return 的是函数，并且能保持当前的 fail 状态
  // throw new Error();
  return fail;
}

// function parseHTML(str) {
//   // <div></div>
//   let state = start;

//   for (const char of str) {
//     // console.log(state.name, char);
//     state = state(char);
//   }
//   state = state(EOF);
//   if (state === success) {
//     // 状态成功
//     return true;
//   } else if (state === fail) {
//     return false;
//   }
// }

function checkHTML(str) {
  // <div></div>
  let state = start;

  for (const char of str) {
    // console.log(state.name, char);
    state = state(char);
  }
  state = state(EOF);
  if (state === success) {
    // 状态成功
    // console.log("=====list", list);
    return true;
  } else if (state === fail) {
    return false;
  }
}

function parseHTML(str) {
  function start(input) {
    if (input === EOF) {
      return end;
    } else if (isAlphabet(input)) {
      return getTextNode;
    } else if (isSpace(input)) {
      return space;
    } else if (input === "<") {
      return tagStart;
    }
  }

  function getTextNode(input) {
    if (input === EOF) {
      return end;
    } else if (isAlphabet(input)) {
      return getTextNode;
    } else if (input === "<") {
      return tagStart;
    }
  }
  function space(input) {
    if (input === EOF) {
    }
  }

  function tagStart(input) {}

  function end(input) {
    console.log("end");
  }

  let state = start();
  let value = "";
  let list = [];

  for (const char of str) {
    state = state(char);
  }
  state(EOF);
  console.log(value);
}

module.exports = {
  parseHTML,
  checkHTML,
};
