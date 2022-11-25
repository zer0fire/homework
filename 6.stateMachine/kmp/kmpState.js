function end(input) {}

// i: ababcaabc
// j:       ababcaabc
//            ^
// n: 001201120
// n = [0, 0, 0, 1, 2, 0, 1, 1, 2, 0]

function genNext(pattern) {
  let next = [0, 0];
  let i = 1,
    j = 0;
  while (i < pattern.length) {
    if (pattern[i] === pattern[j]) {
      j++;
      i++;
      next[i] = j;
    } else if (j === 0) {
      i++;
      next[i] = 0;
    } else {
      j = next[j];
    }
  }
  return next;
}

function search(source, pattern) {
  let next = genNext(pattern);

  let j = 0;
  for (let i = 0; i < source.length; i++) {
    // console.log("=======i", i, "======j", j);
    if (source[i] === pattern[j]) {
      j++;
      if (j === pattern.length) {
        return i - j + 1;
      }
    } else if (j !== 0) {
      j = next[j];
      i--;
    }
  }
  return -1;
}

function strStr(source, needle) {
  let state = genState(needle);
  for (let i = 0; i < source.length; i++) {
    state = state(source[i], i);
    if (state === succeed) {
      return i - (needle.length - 1);
    }
  }
  return -1;
}

function genState(needle) {
  function originState(condition, lastState, input) {
    if (input === condition) {
      return lastState;
    } else {
      return fail;
    }
  }
  // 下一状态，转移条件
  let state = succeed;
  for (let j = needle.length - 1; j >= 0; j--) {
    let lastState = state;
    state = originState.bind(null, needle[j], lastState);
  }
  return state;
}

function start(input) {
  if (input === "s") {
    return findStrS;
  } else {
    return start;
  }
}

function findStrS(input) {
  if (input === "a") {
    return findStrA;
  } else {
    return start;
  }
}

function findStrA(input) {
  if (input === "d") {
    return succeed;
  } else {
    return start;
  }
}

function succeed() {
  throw new Error("illegal success call");
}

module.exports = {
  strStr,
  genNext,
  search,
};
