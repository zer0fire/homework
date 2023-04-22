// mississippi
// issip
// 4
// mississippi
// issipi
// -1
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
function strStr(haystack, needle) {
  const next = [0, 0];
  let i = 1,
    j = 0;
  while (i < needle.length) {
    if (needle[i] === needle[j]) {
      i++;
      j++;
      next[i] = j;
    } else if (j === 0) {
      i++;
      next[i] = j;
    } else {
      j = next[j];
    }
  }

  let l = 0;
  for (let k = 0; k < haystack.length; k++) {
    if (haystack[k] === needle[l]) {
      l++;
      if (l >= needle.length) {
        return k - l + 1;
      }
    } else if (l !== 0) {
      l = next[l];
      k--;
    }
  }
  return -1;
}

function strStr(haystack, needle) {
  let index = -1;
  for (let i = 0; i < haystack.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (needle[i] !== needle[j]) {
        i = i - j;
        break;
      }
      //   同步移动，但其实不用全回去
      i++;
      if (j === needle.length - 1) {
        return i - needle.length;
      }
    }
  }
  return index;
}

// 两个循环，类似的两套代码
function strStr(haystack, needle) {
  let next = [0, 0];
  let i = 1,
    j = 0;
  while (i < needle.length) {
    if (needle[i] === needle[j]) {
      i++;
      j++;
      next[i] = j;
    } else if (j === 0) {
      i++;
      next[i] = j;
    } else {
      j = next[j];
    }
  }

  let l = 0;
  for (let k = 0; k < haystack.length; k++) {
    if (haystack[k] === needle[l]) {
      l++;
      if (l >= needle.length) {
        return k - l + 1;
      }
    } else if (l !== 0) {
      l = next[l];
      k--;
    }
  }
  return -1;
}

function strStr(haystack, needle) {
  let next = [0, 0];
  let i = 1,
    j = 0;
  while (i < needle.length) {
    if (needle[i] === needle[j]) {
      i++;
      j++;
      next[i] = j;
    } else if (j === 0) {
      i++;
      next[i] = j;
    } else {
      i++;
      j = next[j];
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
      k--;
      l = next[l];
    }
  }
  return -1;
}
