/**
 * 分桌子
 * 一群人去餐厅用餐，决定分餐桌坐，分桌子 1 张桌上最少 2 个人， 最多 10 个人
 * n 个人去，应该有几种分法？
 * 6 个人有 4 种分法
 *
 * 2 + 2 + 2 （3 桌）(n -> m 桌，n / 2 ~ n / 10 + n % 10)
 * for(let i = 2; i <= 10; i++)
 * 2 + 4（2 桌）
 * 3 + 3（2 桌）
 * 4 + 2
 * 5 + 1
 * 6（1 桌）
 *
 *  如果一张桌子最多 10 人，那么 100 人分桌，有多少种分法
 *
 */

// expect(check(100, 2)).toBe(437420)
// module.exports = function check(number, minLimit, maxLimit = 10) {
//   // 10
//   // 递归
//   // 2 2 2 2.... 直到 100 -> 0 人
//   // n 个人 ->
//   //  n(10) -> 100 - n -> 0
//   //  n(9) ->
//   if (number <= minLimit) {
//     return 1;
//   }

//   //   6 < 10

//   let count = 0;

//   for (let i = minLimit; i <= maxLimit; i++) {
//     count += check(number - i, minLimit, maxLimit);
//     // 6 - 2 = 4
//     console.log({ count, i });
//     if (number - i <= minLimit) {
//       return count;
//     }
//   }
//   return count;
// };

// 抄，抄好代码

// a2 不看题解，解出来

// total 6 size 2 rest 4
// total 4 size 2 rest 2
// total 2 size 2 rest 0 [2, 2, 2]
// count = 1

// total 4 size 3 rest 1
// total 4 size 4 rest 0 // [2, 4]
// count = 2

// total 6 size 3 rest 3
// total 3 size 2 rest 1
// total 3 size 3 rest 0 // [3, 3]
// count = 3

// total 6 size 4 rest 2
// total 2 size 2 rest 0 // [4, 2]
// count = 4

// total 6 size 5 rest 1
// total 6 size 6 rest 0 // [6]
// count = 5

// 回溯
// function check(total, minLimit = 2, maxLimit = 10) {
//   let filterSet = new Set();

//   function unique(arr) {
//     let sortedArr = arr.slice().sort((a, b) => a - b);
//     const str = sortedArr.join("+");
//     if (filterSet.has(str)) {
//       return false;
//     } else {
//       filterSet.add(str);
//       return true;
//     }
//   }

//   function recursion(total, minLimit = 2, maxLimit = 10, arr = []) {
//     if (total === 1 || total < 0) {
//       return;
//     }
//     if (total === 0) {
//       //   console.log({ arr, total });
//       // 6 [2, 2, 2]
//       // [2, 4]
//       // [3, 3]
//       // [4, 2]
//       // [6]
//       unique(arr); // 一种分法
//       return;
//     }

//     for (let i = minLimit; i <= maxLimit && total >= i; i++) {
//       arr.push(i);
//       recursion(total - i, minLimit, maxLimit, arr);
//       arr.pop(i);
//     }
//   }
//   // 回溯 溯源
//   // 记录分法，去重
//   recursion(total, minLimit, maxLimit);
//   return filterSet.size;
// }

// console.log(check(6, 2));

// expect(check(6, 2)).toBe(4);

// 2 + 5（2）
// 3 + 4 (2)
// 7 ==> 4

// 2 + 6(3)
// 3 + 5(2)
// 4(2) + 4(2)
// 8 ==>

// 递归式
module.exports = function check(total, minLimit = 2, maxLimit = 10) {
  let filterSet = [];
  // 如何分的记录。 里面存的是 arr，arr 就是多次递归之后，发现的一种分法

  function recursion(total, minLimit = 2, maxLimit = 10, arr = []) {
    if (total === 0) {
      //   console.log({ arr, total });
      filterSet.push(arr.slice());
      return;
    }

    for (let i = minLimit; i <= maxLimit && total >= i; i++) {
      arr.push(i);
      // i 作用就是让 min 变得有规律，变得有顺序，必须是后面的分法的最小值大于等于前面的分法
      // 后面的分法的最小值大于等于前面的分法
      // Math.min(total, 10) 的作用是剩下的多少人，会有多少种分法的极限
      recursion(total - i, i, maxLimit, arr);
      arr.pop(i);
    }
  }
  // 记录分法，去重
  recursion(total, minLimit, maxLimit);
  // console.log(filterSet);
  return filterSet.length;
};

// // 动态规划
// function check(n, min) {
//   const dp = new Array(n + 1).fill(0);
//   dp[0] = 1;

//   for (let i = min; i <= Math.min(n, 10); i++) {
//     // 2 2
//     // 两重作用，去重 + 存档
//     for (let j = i; j <= n; j++) {
//       dp[j] += dp[j - i];
//     }
//   }
//   console.log(dp);
//   return dp[n];
// }

// dp = [1, 0, 0, 0, 0];
// [1, 0, 0, 0, 0];

// function fun(n, num = 2) {
//   if (n < 0 || num > max || n < num) {
//     return 0;
//   } else if (n === num) {
//     return 1;
//   } else {
//     return fun(n, num + 1) + fun(n - num, num);
//   }
// }

// 组合问题，并且尽量让结果变得有序
// 1. 凡事动态规划题，研究下n-1和n之间的关系
// 2. 涉及到“组合”，即2 4和4 2算同一种，那么尝试让生成的结果有序
