/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function (s) {
  let map = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let res = 0;
  for (let i = 0; i < s.length; ) {
    let char = s[i];
    let next = s[i + 1];
    console.log(char);
    if (
      (char === "C" && (next == "D" || next === "M")) ||
      (char === "X" && (next == "L" || next === "C")) ||
      (char === "I" && (next == "V" || next === "X"))
    ) {
      let cache = map[s[i + 1]] - map[char];
      // console.log(map[s[i+1]], s[i+1], map[char], char)
      res += cache;
      i += 2;
    } else {
      res += map[char];
      i++;
    }
  }
  return res;
  // IV IX
  // XL XC
  // CD CM
  // M 1000 CM 900 XC 90 IV 4
};
