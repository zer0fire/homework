function check(num, min, max) {
  // 实际分桌子的地方 100 -> 2 - 10
  // 无序的，组合的
  // 不够分，不是一种分法
  if (num < 0) {
    return 0;
  }
  // 正好够分
  if (num === 0) {
    return 1;
  }
  let count = 0;
  for (let i = min; i <= max; i++) {
    count += check(num - i, min, i);
  }
  return count;
}

const mem = {};
function checkMem(num, min, max) {
  // 实际分桌子的地方 100 -> 2 - 10
  // 无序的，组合的
  // 不够分，不是一种分法
  if (num < 0) {
    return 0;
  }
  // 正好够分
  if (num === 0) {
    return 1;
  }
  let count = 0;
  for (let i = min; i <= max; i++) {
    const key = `${num - i}-${min}-${i}`;
    if (mem[key]) {
      count += mem[key];
    } else {
      const res = checkMem(num - i, min, i);
      count += res;
      mem[key] = res;
    }
  }
  return count;
}

module.exports = {
  check,
  checkMem,
};
