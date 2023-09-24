function findSubStr(source, pattern) {
  let index = -1;
  for (let i = 0; i < source.length; i++) {
    // source[i]
    // index pattern[index]
    for (let j = 0; j < pattern.length; j++) {
      if (pattern[j] !== source[j + i]) {
        break;
      }
      if (j === pattern.length - 1) {
        return index;
      }
    }
  }
  return -1;
}
// 双循环

// 约束1，如果 pattern 没有自我重复内容，那么应该跳过 pattern.length 个 index
// abcdefg
// edg
function findSubStr(source, pattern) {
  let j = 0;
  for (let i = 0; i < source.length; i++) {
    if (source[i] !== pattern[j]) {
      j = 0;
      if (source[i] === pattern[0]) {
        i++;
      }
    } else {
      j++;
    }

    if (j === pattern.length) {
      return i - pattern.length + 1;
    }
  }
  return -1;
}

// findSubStr();

console.log(findSubStr("accacsd", "cac"));
console.log(findSubStr("acccac", "cac"));

// mississippi
// issip
