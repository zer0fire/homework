// KMP 算法 - 状态机实现
// 状态机有输入输出，有下一个状态
// 验证一个字符串是否是整数

// (?:[1-9][0-9]*|0)

const EOF = Symbol("EOF");

function notNumber(input) {
  return (
    input.charCodeAt(0) - "0".charCodeAt(0) > 9 ||
    input.charCodeAt(0) - "0".charCodeAt(0) < 0
  );
}

// 输入
/**
 *
 * @param {string} input
 * @returns
 */
function start(input) {
  if (input === ".") {
    return afterDot;
  } else if (input === "0") {
    return singleZero;
  } else if (notNumber(input)) {
    // 得到非数字
    return failed;
  } else {
    // 得到数字
    return gotNumber;
  }
}

function afterDot(input) {
  if (input === EOF) {
    return failed;
  } else {
    return gotNumber;
  }
}

function gotNumber(input) {
  // 非数字就返回 fail
  // 0-9 就返回 gotNumber
  if (input === EOF) {
    return succeed;
  } else if (input === ".") {
    return afterDot;
  } else if (notNumber(input)) {
    // 得到非数字
    return failed;
  } else {
    // 得到数字
    return gotNumber;
  }
}

function singleZero(input) {
  if (input === EOF) {
    return succeed;
  } else if (input === ".") {
    return gotNumber;
  } else {
    return failed;
  }
}

// 结束状态
function succeed(input) {
  throw new Error("illegal succeed call");
  // return succeed;
}

function failed(input) {
  // fail 的时候，return 的是函数，并且能保持当前的 fail 状态
  // throw new Error();
  return failed;
}

function checkDec(str) {
  let state = start;

  for (const char of str) {
    // console.log(char);
    state = state(char);
  }
  state = state(EOF);
  if (state === succeed) {
    // 状态成功
    return true;
  } else if (state === failed) {
    return false;
  }
}

// HTML 标签解析，start end 标签
// 看 html 节点
// 编译 vue，解析图片节点，等等

module.exports = {
  checkDec,
};

// 作业：html 元素和文本节点，只分析文本
// <div><span>123</span></div>
// 最好支持属性 istanbul
// cypress

function checkHTML(str) {}

checkHTML("<div><span>123</span></div>");
