/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function (a, b) {
  let carry = 0;
  let i = a.length - 1;
  let j = b.length - 1;
  let res = "";
  while (a[i] || b[j] || carry) {
    let left = 0;
    if (a[i]) {
      left = Number(a[i]);
    }

    let right = 0;
    if (b[j]) {
      right = Number(b[j]);
    }

    let cache = left + right + carry;
    if (cache > 1) {
      carry = 1;
      cache = cache % 2;
    } else {
      carry = 0;
    }
    res = String(cache) + res;
    i--;
    j--;
  }
  return res;
};
