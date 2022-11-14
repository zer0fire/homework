/**
 *
 * @param {string} source
 * @param {string} pattern
 */
function findSubstr(source, pattern) {
  // abcdefghijklmn
  // defg
  // 首先先找到 source 里 pattern 第一位的位置，然后循环，看后面的是不是也一致
  // 只变 j

  // 再处理自重复串就可以了
  let j = 0;
  for (let i = 0; i < source.length; i++) {
    if (pattern[j] !== source[i]) {
      // 替代 for 循环
      // 字符串没有重复字母
      // j 归 0
      j = 0;
      // 从头开始比
      // pattern[0]
      if (pattern[j] === source[i]) {
        // i j 的双指针，j 要去适应 i，跟着 i 一起走
        // 从头开始比不能简单的 i++
        // i++
        // console.log(i, j);
        j++;
      }
    } else {
      j++;
    }
    // pattern 进 1
    if (j === pattern.length) {
      // 过去的 length 被减掉
      return i - pattern.length + 1;
    }
  }
  return -1;
}

// findSubstr("abcdefghijklmn", "defg");

module.exports = {
  findSubstr,
};

// 链表上的 6 字环，0 字环，8 字环

// 手动写 pattern 的状态机
// 用代码生成状态机，处理 pattern，把 pattern 变成状态机

// 状态机处理流，状态机处理字符串
// https://leetcode.cn/problems/wildcard-matching/

// cocos -> 求一个圆的元素和另外一个线的元素，是否是割线
// 垂心，线的两个端点
// 线段的 90 度向量，看在不在两端点的中间
// 计算几何
// 有个点是否落在三角形里，多边形内是否有个点

// 计算机图形学，第四版
// 计算几何
// 交互式计算机

/**
 * @param {string} source
 * @param {string} pattern
 * @return {number}
 */
var strStr = function (source, pattern) {
  let j = 0;
  let note = 0;
  for (let i = 0; i < source.length; i++) {
    console.log("11");
    if (source[i] !== pattern[j]) {
      if (note >= 1) {
        // note 存储到底匹配了多少，如果大于 1，i 就不能从头开始，需要从头的第二个开始比
        i = i - (note - 1);
        j = 0;
        note = 0;
      } else {
        j = 0;
        note = 0;
      }
      if (source[i] === pattern[j]) {
        j++; // 这里是j++
        note++;
      }
    } else {
      j++;
      note++;
    }
    if (j === pattern.length) {
      return i - j + 1;
    }
  }
  return -1;
};
