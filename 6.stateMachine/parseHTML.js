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
  return isLowercase(char) || isUppercase(char);
}

// 输入
/**
 *
 * @param {string} input
 * @returns
 */
function start(input) {
  //   console.log("start");
  if (input === "<") {
    return tagStart;
  } else if (input === " ") {
    return space;
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
    return tagEndStart;
  } else if (isAlphabet(input)) {
    return tagStartName;
  } else {
    return fail;
  }
}

function tagStartName(input) {
  //   console.log("tagStartName");
  if (isAlphabet(input)) {
    return tagStartName;
  } else if (input === ">") {
    return start;
  } else if (input === " ") {
    return space;
  } else {
    return fail;
  }
}

function tagEndStart(input) {
  if (isAlphabet(input)) {
    return tagEndName;
  } else if (input === " ") {
    return fail;
  }
}

function tagEndName(input) {
  //   console.log("tagEndName");
  if (isAlphabet(input)) {
    return tagEndName;
  } else if (input === " ") {
    return tagEndName;
  } else if (input === ">") {
    return tagEnd;
  } else {
    return fail;
  }
}

function tagEnd(input) {
  if (input === EOF) {
    return success;
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

function parseHTML(str) {
  // <div></div>
  let state = start;

  for (const char of str) {
    // console.log(state.name, char);
    state = state(char);
  }
  state = state(EOF);
  if (state === success) {
    // 状态成功
    return true;
  } else if (state === fail) {
    return false;
  }
}

module.exports = {
  parseHTML,
};
