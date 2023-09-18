/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
  if (x < 0) {
    return false;
  }
  let s = String(x);
  let l = 0;
  let r = s.length - 1;
  while (l < r) {
    console.log(s[l], s[r]);
    if (s[l] !== s[r]) {
      return false;
    }
    l++;
    r--;
  }
  return true;
};
