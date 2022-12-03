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

// 从状态机的角度理解 kmp 或者其他动态规划题，好像就是限定状态不能无限转移而是有规律的转移，
// 这个规律不一而足，有可能是根据一个公式或者公式的叠加，但是为什么要这么做却不清楚，只能说是目前按照这个规律去做事了

// function find0(input) {
//   if (input === "a") {
//     return find1;
//   } else {
//     return find0;
//   }
// }

// function find1(input) {
//   if (input === "a") {
//     return find1;
//   } else if (input === "b") {
//     return find2;
//   } else {
//     return find0;
//   }
// }

// function find2(input) {
//   if (input === "a") {
//     return find3;
//   } else {
//     return find0;
//   }
// }

// function find3(input) {
//   if (input === "a") {
//     return find1;
//   } else if (input === "b") {
//     return find4;
//   } else {
//     return find0;
//   }
// }

// function find4(input) {
//   if (input === "a") {
//     return find5;
//   } else {
//     return find0;
//   }
// }

// function find5(input) {
//   if (input === "c") {
//     return succeed;
//   } else if (input === "b") {
//     return find4;
//   } else if (input === "a") {
//     return find1;
//   } else {
//     return find0;
//   }
// }

// function start(input) {
//   if (input === "a") {
//     return find1;
//   } else {
//     return start;
//   }
// }

// function find1(char) {
//   if (char === "b") {
//     return find3;
//   } else {
//     return start(char);
//   }
// }

// function find2(char) {
//   if (char === "b") {
//     return find3;
//   } else {
//     return start(char);
//   }
// }

// function find3(char) {
//   if (char === "c") {
//     return succeed;
//   } else if (char === "a") {
//     return find2;
//   } else {
//     return start(char);
//   }
// }

// { a: nextStateA, b: nextStateB }

function strStr(source, needle) {
  let start;
  const allStates = [];
  let next = [0, 0];

  function findX(map, reconsume, n) {
    return function findNext(char) {
      // console.log("call", map);
      if (map.has(char)) {
        const v = map.get(char);
        return allStates[v];
      } else {
        if (reconsume) {
          return allStates[n](char);
        } else {
          return start;
        }
      }
    };
  }

  function genState(needle) {
    // 下一状态，转移条件
    let state;
    for (let j = 0; j < needle.length; j++) {
      const map = new Map();
      map.set(needle[j], j + 1);
      state = findX(map, j !== 0, next[j]);
      allStates.push(state);
    }
    start = allStates[0];
    allStates.push(succeed);
    return start;
  }

  function genNext(pattern) {
    for (let i = 1, j = 0; i < pattern.length; i++) {
      if (pattern[i] === pattern[j]) {
        j++;
        next[i + 1] = j;
      } else if (j === 0) {
        next[i + 1] = 0;
      } else {
        i--;
        j = next[j];
      }
    }
  }
  genNext(needle);
  let state = genState(needle);
  // let state = find0;

  for (let i = 0; i < source.length; i++) {
    // console.log(state.name, i, source[i]);
    // console.log(state, i, source[i]);
    state = state(source[i]);
    if (state === succeed) {
      return i - (needle.length - 1);
    }
  }
  return -1;
}

// 前面的已经算过了，就是说这个部分其实是重复的，如果比过后面的相等，前面的就不必再比了，
// 如果不等，就和前面的再比

module.exports = {
  strStr,
};

// 射线法相交，
// 算点到外面点，是否能围成一个正确图形
// 以当前点为中心做一个极坐标系，
// 转角法
// 海龙公式

// 用状态机的方式过 leetcode
// 一次循环就能搞定所有状态机和 next
