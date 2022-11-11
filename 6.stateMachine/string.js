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
    inner: for (let j = 0; j < pattern.length; j++) {
      //   如果 pattern 里没有重复的字母，那么，j 里面经过的子字符是可以直接跳过的，因此可以 i + j
      if (pattern[j] !== source[j + i]) {
        i += j - 1;
        continue outer;
      }
    }
    return i;
  }
  return -1;
}

module.exports = {
  findSubstr,
};

// 链表上的 6 字环，0 字环，8 字环
