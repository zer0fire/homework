function parse(str) {
  for (let char of str) {
  }
}

// 输入
function start(input) {
  // 输出
  console.log(1);
  // 下一个状态
  return a;
}

// 结束状态
function success() {
  throw new Error();
}

const EOF = Symbol("EOF");

// 输入
/**
 *
 * @param {string} input
 * @returns
 */
function start(input) {
  if (input === "0") {
    return singleZero;
  } else if (
    input.charCodeAt(0) - "0".charCodeAt(0) > 9 ||
    input.charCodeAt(0) - "0".charCodeAt(0) < 0
  ) {
    // 得到非数字
    return fail;
  } else {
    // 得到数字
    return gotNumber;
  }
}

function gotNumber(input) {
  // 非数字就返回 fail
  // 0-9 就返回 gotNumber
  if (input === EOF) {
    return success;
  } else if (
    input.charCodeAt(0) - "0".charCodeAt(0) > 9 ||
    input.charCodeAt(0) - "0".charCodeAt(0) < 0
  ) {
    // 得到非数字
    return fail;
  } else {
    // 得到数字
    return gotNumber;
  }
}

function singleZero(input) {
  if (input === EOF) {
    return success;
  } else {
    return fail;
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

function check(str) {
  let state = start;

  for (const char of str) {
    // console.log(char);
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

console.log(check("10"));
console.log(check("w10"));
console.log(check("0"));
console.log(check("0123"));
console.log(check("123"));

// HTML 标签解析，start end 标签
// console.log(check(''));
// 单测
