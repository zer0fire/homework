/**
 * @param {number} n
 * @return {number}
 */
var binaryGap = function (n) {
  if (n === 1 || n === 0) {
    return 0;
  }
  let str = n.toString(2);
  if (str.split("").reduce((a, b) => a + Number(b), 0) === 1) {
    return 0;
  }
  let dis = 0;
  let max = 0;
  let left = -1;
  let right = -1;
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (char === "1" && left === -1) {
      left = i;
    } else if (char === "1" && right === -1) {
      right = i;
    }
    if (left !== -1 && right !== -1) {
      dis = right - left;
      if (dis > max) {
        max = dis;
      }
      left = i;
      right = -1;
    }
  }
  return max;
};
