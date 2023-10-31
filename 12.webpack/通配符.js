function closure(s, p) {
  let map = {
    // s+p: true / false
  };

  var isMatch = function (s, p) {
    // console.info('isMatch', s, p)
    if (map.hasOwnProperty(s + p)) {
      return map[s + p];
    }
    let pIndex = 0;
    if (p === "*") return true;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === p[pIndex] || p[pIndex] === "?") {
        pIndex++;
      } else if (p[pIndex] === "*") {
        for (let j = 0; j < s.slice(i).length; j++) {
          let res = isMatch(s.slice(i + j), p.slice(pIndex + 1));
          map[s + p] = res;
          if (res) {
            return true;
          }
        }
      } else {
        return false;
      }
    }
    const leftP = p.slice(pIndex);
    if (leftP.length > 0) {
      for (let j = 0; j < leftP.length; j++) {
        if (leftP[j] !== "*") return false;
      }
      return true;
    }
    return true;
  };
  return isMatch(s, p);
}

// console.info(closure("abcabczzzde", "*abc???de*"));
// console.info(closure("adceb", "*a*b"));
console.info(
  closure(
    "babaaababaabababbbbbbaabaabbabababbaababbaaabbbaaab",
    "***bba**a*bbba**aab**b"
  )
);
// console.log(closure("bb", "?*"));
// s =
// "baaabbabbbaabbbbbbabbbaaabbaabbbbbaaaabbbbbabaaaaabbabbaabaaababaabaaabaaaabbabbbaabbbbbaababbbabaaabaabaaabbbaababaaabaaabaaaabbabaabbbabababbbbabbaaababbabbaabbaabbbbabaaabbababbabababbaabaabbaaabbba"
// p =
// "*b*ab*bb***abba*a**ab***b*aaa*a*b****a*b*bb**b**ab*ba**bb*bb*baab****bab*bbb**a*a*aab*b****b**ba**abba"
