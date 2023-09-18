/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function (s) {
  let res = 0;
  let sign = 1;
  let i = 0;
  while (s[i] === " ") {
    i++;
  }
  if (s[i] === "-") {
    sign = -1;
    i++;
  } else if (s[i] === "+") {
    i++;
  }
  while (s[i] !== " " && !Number.isNaN(Number(s[i]))) {
    res = res * 10 + Number(s[i]);
    i++;
  }
  if (sign === 1 && res > 2 ** 31 - 1) {
    return 2 ** 31 - 1;
  } else if (sign === -1 && res > 2 ** 31) {
    return sign * 2 ** 31;
  }
  return sign * res;
};
