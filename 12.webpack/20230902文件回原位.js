/**
 *
 * @param {number} n
 */
let listPath = [];
function allPermutation(n, len = 1, res = []) {
  if (len === n + 1) {
    // console.log(res);
    listPath.push(res.slice());
    return;
  }
  for (let i = 1; i <= n; i++) {
    if (!res.includes(i)) {
      res.push(i);
      allPermutation(n, len + 1, res);
      res.pop();
    }
  }
  return res;
}
allPermutation(4);
// console.log();
// console.log(listPath);

/**
 *
 * @param {string} arr 文件字符数组
 */
function arrangement(arr) {
  while (!arr.every((v, i) => v === i + 1)) {
    // 需要判定某一位是否有更小的数字
    let i = -1;
    for (let j = 0; j < arr.length; j++) {
      let cache = findSmall(arr[j], arr);
      if (cache > 0) {
        i = cache;
      }
    }
    // 如果有，就把更小的数字放在最前面
    // 继续循环
    if (i > 0) {
      unshift(arr, i);
      console.log(
        "🚀 ~ file: 20230902文件回原位.js:43 ~ arrangement ~ arr[i]:"
      );
    }
  }
  return arr;
}

console.log(arrangement([1, 3, 2]));

// function isSorted(arr) {
//   const arr2 = arr.slice(1);
//   // [1,2,3,4]
//   // [2,3,4]
//   return arr.every((item, i) => item < arr2[i]);
// }

function findSmall(num, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (num - arr[i] === 1) {
      return i;
    }
  }
  return -1;
}

/**
 *
 * @param {number[]} res
 * @param {*} i
 */
function unshift(res, i) {
  let num = res[i];
  res.splice(i, 1);
  res.unshift(num);
}

// 检查挪了之后是否是升序的

// 2 3 1
// 1 2 3

// 3 1 2
// 2 3 1
// 1 2 3

// 1 3 2
// 2 1 3
// 1 2 3

/**
 *
 * @param {string} a1
 * @param {string} a2
 */
function compare(a1, a2) {
  return a1 - a2;
}

// 通项公式
