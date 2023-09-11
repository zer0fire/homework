// TODO:
// 最简分数
// 分子和分母两数之和是 20 的最简分数的个数是 4 个
// 1/19 3/17 7/12 9/11
// 1234567 的 0 到 1 之间的最简分数的个数 612360
function simpleNum(num) {
  // 20
  let count = 0;
  // 19 num - i 1
  // 18 num - i 2
  for (let i = num - 1; i > 0 && num - i < i; i--) {
    if (isSimple(i, num - i)) {
      count++;
    }
  }
  return count;
}

function isSimple(m, c) {
  // 通过除一半的方式？
  for (let i = parseInt(m / 2); i > 1; i--) {
    if (m % i === 0 && c % i === 0) {
      return false;
    }
  }
  return true;
}

module.exports = {
  simpleNum,
};
