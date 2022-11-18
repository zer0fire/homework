// findSubstr("abcdefghijklmn", "defg");

// state 是一个可以转移的状态，那么如果 fail 就重新开始
// pattern[j] source[i] 本身是一个比对过程，
// 需要 source[i] 进状态机
// 如果 fail ，那么说明需要重置，j = 0
// 如果没 fail，那么说明需要继续比，需要生成新状态
// 直到循环结束，j === pattern.length 其实就说明成功，
// 相当于我们状态机运行到最后一个状态，相当于成功
// 否则 i 循环结束，返回 -1
function fail() {
  return fail;
}
function success() {
  throw new Error("illegal success call");
}

function findSubstrState(source, pattern) {
  let start = genState(pattern);
  let state = start;
  for (let i = 0; i < source.length; i++) {
    // state = state(source[i], pattern[j]);
    if (state(source[i]) === fail) {
      // j 归 0
      state = start;
      // 从头开始比
    } else {
      // pattern 进 1
      state = state(source[i]);
      if (state === success) {
        // 过去的 length 被减掉
        return i - pattern.length + 1;
      }
    }
  }
  return -1;
}

function genState(pattern) {
  function originState(condition, lastState, input) {
    if (input === condition) {
      return lastState;
    } else {
      return fail;
    }
  }
  // 下一状态，转移条件
  let state = success;
  for (let j = pattern.length - 1; j >= 0; j--) {
    let lastState = state;
    state = originState.bind(null, pattern[j], lastState);
  }
  return state;
}

module.exports = {
  findSubstrState,
};
