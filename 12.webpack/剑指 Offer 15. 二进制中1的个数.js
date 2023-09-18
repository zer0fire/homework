/**
 * @param {number} n - a positive integer
 * @return {number}
 */
var hammingWeight = function (n) {
  let s = n.toString(2);
  let res = 0;
  for (let char of s) {
    if (char === "1") {
      res++;
    }
  }
  return res;
};
