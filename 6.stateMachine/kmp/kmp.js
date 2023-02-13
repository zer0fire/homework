// function search(source, pattern) {
//   outer: for (let i = 0; i < source.length; i++) {
//     for (let j = 0; j < pattern.length; j++) {
//       if (source[i] !== pattern[j]) {
//         continue outer;
//       }
//     }
//     return i;
//   }
//   return -1;
// }

// function search2(source, pattern) {
//   let j = 0;
//   for (let i = 0; i < source.length; i++) {
//     // console.log("=======i", i, "======j", j);
//     if (source[i] === pattern[j]) {
//       j++;
//       if (j === pattern.length) {
//         return i - j + 1;
//       }
//     } else if (j !== 0) {
//       j = 0;
//       i--;
//     }
//   }
//   return -1;
// }

// // 没有自重复性的字符串，search2 就可以通过

// // 自己和自己比对，找到重复的地方，通过 next 找到重复的位置，next 表达了就是该字母前面有多少重复的子串

// /*
// j: ababc
// i: ababc
// n: 00012
// */

// function search3(source, pattern) {
//   //   const next = Array(pattern.length).fill(0);
//   const next = [0, 0, 0, 1, 2];

//   let j = 0;
//   for (let i = 0; i < source.length; i++) {
//     // console.log("=======i", i, "======j", j);
//     if (source[i] === pattern[j]) {
//       j++;
//       if (j === pattern.length) {
//         return i - j + 1;
//       }
//     } else if (j !== 0) {
//       j = next[j];
//       i--;
//     }
//   }
//   return -1;
// }

// function search4(source, pattern) {
//   //   const next = Array(pattern.length).fill(0);

//   //    i: abababc
//   //    j:    ababc
//   //             ^
//   //    n: 0101230
//   //final: 00101230

//   //    i: aabaabx
//   //    j:    aabaabx
//   //             ^
//   //    n: 0101230
//   //final: 00101230

//   //   i: aabaabaaaa
//   //   j:          aabaabaaaa
//   //               ^
//   //   n: 0101234501
//   //   复杂的情况，j 不应该直接归 0

//   //   i: aabaabaaaa
//   //   j:         aabaabaaaa
//   //               ^
//   //   n: 0101234522
//   //   复杂的情况，j 不应该直接归 0
//   //   这里后面的两个 2 是因为什么？next 数组是一边回去，一边要用
//   // next 一方面，需要记录重复的子串，比如 aabaab 就是 0 - 5，另外一方面，还需要用 next 查找，当子串出现不重复的时候，就需要到 next 附近的地方
//   //   i: aabaabaaab
//   //   j:        aabaabaaaab
//   //               ^
//   //   n: 0101234523
//   // 每次先挪光标
//   //   i: aabaabaaab
//   //   j:        aabaabaaaab
//   //               ^
//   //   n: 0101234523

//   //   i: aabaabaaab
//   //   j:   aabaabaaaab
//   //        ^
//   //   n: 0101234523
//   const next = [0, 1, 0, 1, 2, 3, 4, 5, 2, 3];

//   let j = 0;
//   for (let i = 0; i < source.length; i++) {
//     // console.log("=======i", i, "======j", j);
//     if (source[i] === pattern[j]) {
//       j++;
//       if (j === pattern.length) {
//         return i - j + 1;
//       }
//     } else if (j !== 0) {
//       j = next[j];
//       i--;
//     }
//   }
//   return -1;
// }

// // function genNext(pattern) {
// //   let next = [0, 0];
// //   // 相等的时候，箭头 i 后移，j 不动
// //   // 不相等的时候，j 调整到 next[j] 对应的数值的

// //   let i = 1,
// //     j = 0;
// //   while (i < pattern.length) {
// //     if (pattern[i] === pattern[j]) {
// //       j++;
// //       i++;
// //       next[i] = j;
// //     } else {
// //       j = next[j];
// //       if (j === 0) {
// //         i++;
// //         next[i] = 0;
// //       }
// //     }
// //   }
// //   return next;
// // }

// function genNext(pattern) {
//   //   i: aabaabaaab
//   //   j:  aabaabaaaab
//   //        ^
//   //   n: 0101234523
//   let next = [0, 0];
//   let j = 0,
//     i = 1;
//   for (let j = 0, i = 1; i < pattern.length; i++) {
//     if (pattern[i] === pattern[j]) {
//       j++;
//       //   为什么这个地方不用 push ，而要用 next[i+1] = j
//       next.push(j);
//     } else if (j === 0) {
//       next.push(0);
//     } else {
//       j = next[j];
//       i--;
//     }
//   }
//   return next;
// }

// function genNext2(pattern) {
//   let next = [0, 0];
//   // 相等的时候，箭头 i 后移，j 不动
//   // 不相等的时候，j 调整到 next[j] 对应的数值的

//   let i = 1,
//     j = 0;
//   while (i < pattern.length) {
//     if (pattern[i] === pattern[j]) {
//       j++;
//       i++;
//       next[i] = j;
//     } else if (j === 0) {
//       i++;
//       next[i] = 0;
//     } else {
//       j = next[j];
//     }
//   }
//   return next;
// }

// function genNext3(pattern) {
//   let next = [0, 0];
//   let i = 1,
//     j = 0;
//   while (i < pattern.length) {
//     if (pattern[i] === pattern[j]) {
//       j++;
//       i++;
//       next[i] = j;
//     } else {
//       j = next[j];
//       if (j === 0) {
//         i++;
//         next[i] = 0;
//       }
//     }
//   }
//   return next;
// }

// function search5(source, pattern) {
//   let next = genNext(pattern);

//   let j = 0;
//   for (let i = 0; i < source.length; i++) {
//     // console.log("=======i", i, "======j", j);
//     if (source[i] === pattern[j]) {
//       j++;
//       if (j === pattern.length) {
//         return i - j + 1;
//       }
//     } else if (j !== 0) {
//       j = next[j];
//       i--;
//     }
//   }
//   return -1;
// }

// // console.log(JSON.stringify(genNext("aabaabaaab")));

// module.exports = {
//   search,
//   search2,
//   search3,
//   search4,
//   search5,
//   genNext,
//   genNext3,
// };

// // 字符串的另一种形式，流
// // 状态机写 kmp

// /**
//  * @param {string} haystack
//  * @param {string} needle
//  * @return {number}
//  */
// function strStr(source, pattern) {
//   function genNext(pattern) {
//     let next = [0, 0];
//     let i = 1,
//       j = 0;
//     while (i < pattern.length) {
//       if (pattern[i] === pattern[j]) {
//         j++;
//         i++;
//         next[i] = j;
//       } else if (j === 0) {
//         i++;
//         next[i] = 0;
//       } else {
//         j = next[j];
//       }
//     }
//     return next;
//   }

//   function search(source, pattern) {
//     let next = genNext(pattern);

//     let j = 0;
//     for (let i = 0; i < source.length; i++) {
//       // console.log("=======i", i, "======j", j);
//       if (source[i] === pattern[j]) {
//         j++;
//         if (j === pattern.length) {
//           return i - j + 1;
//         }
//       } else if (j !== 0) {
//         j = next[j];
//         i--;
//       }
//     }
//     return -1;
//   }
//   return search(source, pattern);
// }

// // 多边形在多边形内
// // kmp 的 j === 0 分支

function start(input) {}

function end(input) {}

// i: ababcaabc
// j:  ababcaabc
//     ^
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

// ("mississippi");
// ("issip");

module.exports = {
  search,
  genNext,
};
