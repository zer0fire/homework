/**
 * @param {number} x
 * @return {number}
 */
var reverse = function (x) {
  if (x > 2 ** 31 - 1 || x < -(2 ** 31)) {
    return 0;
  }
  let sign = x > 0 ? 1 : -1;
  x = sign * x;
  let res = 0;
  while (x !== 0) {
    let bit = x % 10;
    res = res * 10 + bit;
    x = Math.floor(x / 10);
  }
  if (res > 2 ** 31 - 1) {
    return 0;
  }
  return res * sign;
};
