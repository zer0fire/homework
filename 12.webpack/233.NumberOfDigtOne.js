/**
 * @param {number} n
 * @return {number}
 */
var countDigitOne = function (n) {
  // 13
  if (n <= 0) return 0;
  if (n < 10) return 1;
  // 13 -> 2
  let len = n.toString().length;
  // 10  1  => base = 10
  let base = Math.pow(10, len - 1);
  // parseInt(13 / 10) = 1
  let ans = parseInt(n / base);
  // 13  remainder = 3
  let remainder = n % base;
  let oneInBase = 0;
  if (ans === 1) {
    // 13 - 10 + 1
    oneInBase = n - base + 1;
  } else {
    // 1-9
    //
    oneInBase = base;
  }
  return countDigitOne(base - 1) * ans + oneInBase + countDigitOne(remainder);
};

// 13 12 11 10 9 8 7 6 5 4 3 2 1 0

var countDigitOne = (n) => {
  if (n <= 0) return 0;
  if (n < 10) return 1;
  let ans = 0;
  for (let i = 1; i <= n; i *= 10) {
    // d = 1 * 10 = 10
    const d = i * 10;
    // q = Math.floor(13/10) = 1
    const q = Math.floor(n / d);
    // r = 13 % 10 = 3
    const r = n % d;
    // ans += 1 * 1 + Math.min(Math.max(3 - 1 + 1， 0), 1)
    // ans = 2
    ans += q * i + Math.min(Math.max(r - i + 1, 0), i);
  }
  return ans;
};
