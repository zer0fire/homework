//  leetco
//  leetco
//       ^
//  001000

/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function (haystack, needle) {
  // sadbutsad
  // sad
  let n = [0, 0];
  let i = 1,
    j = 0;
  while (i < needle.length) {
    if (needle[i] === needle[j]) {
      j++;
      i++;
      n[i] = j;
    } else if (j === 0) {
      i++;
      n[i] = 0;
    } else {
      j = n[j];
    }
  }
  let l = 0;
  for (let k = 0; k < haystack.length; k++) {
    if (haystack[k] === needle[l]) {
      l++;
      if (l === needle.length) {
        return k - l + 1;
      }
    } else if (l !== 0) {
      l = n[l];
      k--;
    }
  }
  return -1;
};

// 20230206
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
function strStr(source, pattern) {
  let next = [0, 0];
  let i = 1,
    j = 0;
  while (i < pattern.length) {
    if (pattern[i] === pattern[j]) {
      i++;
      j++;
      next[i] = j;
    } else if (j === 0) {
      i++;
      next[i] = 0;
    } else {
      j = next[j];
    }
  }
  console.log(next);
  let l = 0;
  for (let k = 0; k < source.length; k++) {
    if (source[k] === pattern[l]) {
      l++;
      if (l === pattern.length) {
        return k - l + 1;
      }
    } else if (l !== 0) {
      l = next[l];
      k--;
    }
  }
  return -1;
}
