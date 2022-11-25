function succeed() {
  throw new Error("illegal succeed");
}
// i: ababcaabc
// j:       ababcaabc
//            ^
// n: 001201120
// n = [0, 0, 0, 1, 2, 0, 1, 1, 2, 0]

// ababc

// abababcdef
// ababc
function start(input) {
  if (input === "a") {
    return findA;
  } else {
    return start;
  }
}

function findA(char) {
  if (char === "b") {
    return findB;
  } else {
    return start(char);
  }
}

function findB(char) {
  if (char === "a") {
    return findC;
  } else {
    return start(char);
  }
}

function findC(char) {
  if (char === "b") {
    return findD;
  } else {
    return start(char);
  }
}

function findD(char) {
  if (char === "c") {
    return succeed;
  } else {
    return findB(char);
  }
}

function strStr(source, needle) {
  let state = start;
  for (let i = 0; i < source.length; i++) {
    console.log(state.name, i, needle[i]);
    state = state(source[i]);
    if (state === succeed) {
      return i - (needle.length - 1);
    }
  }
  return -1;
}

// function genState(needle) {
//   function originState(condition, lastState, input) {
//     if (input === condition) {
//       return succeed;
//     } else {
//       return fail;
//     }
//   }
//   // 下一状态，转移条件
//   let state = succeed;
//   for (let j = needle.length - 1; j >= 0; j--) {
//     let lastState = state;
//     state = originState.bind(null, needle[j], lastState);
//   }
//   return state;
// }

module.exports = {
  strStr,
};
