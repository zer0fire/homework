// 长宽不过 1000，且可以正好分成 20 个正方形
// 不用考虑小的情况，先从最大的开始裁剪

// 边长循环
//
// 长宽不能相等

function check(len = 1000) {
  let total = 0;
  // 8 * 5 -> 5 -> 5 * 3 -> 3 -> 3 * 2 -> 2 -> 2 * 1 -> 1 -> 1
  // 8 * 4 -> 2
  // 8 * 3 -> 5
  // 8 * 2 -> 4
  // 8 * 1 -> 8
  // j 代表长，i 代表宽，i < j， i 可以等与 j - 1
  for (let j = len; j > 0; j--) {
    for (let i = j - 1; i > 0; i--) {
      if (cut(i, j) === 20) {
        total += 1;
      }
    }
  }
  return total;
}

// 1. 可以一次拆分多个正方形，通过除法
// 2. 如果最终拆除的正方形大于 20 个，结束递归，此次不成立

let memo = {};
function cut(w, h, count = 0) {
  if (count > 21) {
    return count;
  }
  let res = memo[`${w},${h}`];
  if (res) {
    return res;
  }
  if (w === h) {
    return 1;
  }
  let max = 0;
  let min = 0;
  if (w > h) {
    max = w;
    min = h;
  } else {
    max = h;
    min = w;
  }

  let mod = max % min;
  let quotient = Math.floor(max / min);
  // 8 4 = 2
  if (mod === 0) {
    // 如果余数
    return quotient;
  }
  return (memo[`${w},${h}`] = cut(mod, min, count + 1) + quotient);
}

// 一笔九宫格
// 八进制

// const total = check(1000);
// console.log(total);

module.exports = {
  check,
};
