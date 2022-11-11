/**
 *
 * @param {string} source
 * @param {string} pattern
 */
function findSubstr(source, pattern) {
  // abcdefghijklmn
  // defg
  // 首先先找到 source 里 pattern 第一位的位置，然后循环，看后面的是不是也一致
  outer: for (let i = 0; i < source.length; i++) {
    let result = true;
    inner: for (let j = 0; j < pattern.length; j++) {
      if (pattern[j] !== source[j + i]) {
        // continue outer;
        result = false;
        break;
      }
    }
    if (result) {
      return i;
    }
    // return i;
  }
  return -1;
}

module.exports = {
  findSubstr,
};

// 链表上的 6 字环，0 字环，8 字环
