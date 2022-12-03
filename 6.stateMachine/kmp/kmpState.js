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

/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */

function strStr(source, needle) {
  let start;
  let next = [0, 0];
  const allStates = [];

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
  function succeed() {
    throw new Error("illegal succeed");
  }

  function genNext(pattern) {
    let nextState;
    function updateAllState(pattern, i) {
      const map = new Map();
      map.set(pattern[i], i + 1);
      nextState = findX(map, i !== 0, next[i]);
      allStates.push(nextState);
    }
    for (let i = 0, j = 0; i < pattern.length; i++) {
      if (i < 1) {
        // i = 0
        updateAllState(pattern, i);
      } else {
        // i = 1, i < pattern.length
        if (pattern[i] === pattern[j]) {
          j++;
          next[i + 1] = j;
          updateAllState(pattern, i);
        } else if (j === 0) {
          next[i + 1] = 0;
          updateAllState(pattern, i);
        } else {
          i--;
          j = next[j];
        }
      }
    }
    start = allStates[0];
    allStates.push(succeed);
    return start;
  }

  let state = genNext(needle);
  for (let i = 0; i < source.length; i++) {
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
