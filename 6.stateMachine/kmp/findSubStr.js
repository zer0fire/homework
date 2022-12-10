// 给定两个字符串A和B，以及一个正整数k，要求在B中找到包含A中所有字符的子字符串，
// 并且这个子字符串的长度是字符串A的长度加上k。查找第一个符合条件的子串并返回其首字母下标。
// 如果没有符合条件的子串则返回-1.
// 示例1：find('abc', 'cabcabce', 1) // 符合条件的有cabc、abca、bcab、cabc、abce，返回0
// 示例2：find('abc', 'abc', 1) // 找不到符合条件的子串，返回-1

/**
 *
 * @param {String} A
 * @param {String} B
 * @param {Number} k
 * @returns
 */
function find(A, B, k) {
  if (A.length + k >= B.length) {
    return -1;
  }

  outer: for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < B.length; j++) {
      if (!A.slice(i, i + B.length).includes(B[j])) {
        continue;
      }
    }
    return i;
  }
}

// # 2. 求服务启动时间
// 已知每个服务启动都需要一定时间，且每个服务可能依赖其他的服务启动。现给定一个n*n的二维数组arr，arr[i][i]表示i服务启动需要的时间，arr[i][j]表示i服务是否依赖j服务，如果为1表示依赖，0表示不依赖。当服务依赖的服务彼此之间没有依赖关系时，这些服务可以并行启动。题目保证服务之间不存在循环依赖关系，求服务k（1<=k<=n）启动需要的时间。<br />示例1：<br />输入：
// ```javascript
// arr = [
//   [1, 0, 0],
//   [1, 2, 0],
//   [0, 1, 3]
// ]
// k = 3
// ```
// 输出：6<br />说明：服务3启动需要依赖服务2，服务2启动需要依赖服务1，所以需要的时间为3 + 2 + 1 = 6<br />示例2：<br />输入：
// ```javascript
// arr = [
//   [1, 0, 0, 0],
//   [1, 2, 0, 0],
//   [1, 1, 3, 0],
//   [0, 0, 1, 4]
// ]
// k = 4
// ```
// 输出：10<br />说明：服务4启动需要依赖服务3，服务3启动需要依赖服务1和服务2，服务2启动需要依赖服务1，因此服务4启动需要的时间是服务1、服务2、服务3、和服务4启动的时间和：1 + 2 + 3 + 4 = 10<br />示例3：<br />输入：
// ```javascript
// arr = [
//   [1, 0, 0, 0],
//   [1, 2, 0, 0],
//   [1, 0, 3, 0],
//   [0, 1, 1, 4]
// ]
// 2+1 / 3+1 + 4
// k = 4
// ```
// 输出：8<br />说明：服务4启动需要依赖服务3和服务2，服务3和服务2启动都需要依赖服务1，服务3启动需要时间为3 + 1 = 4，服务2启动需要时间为2 + 1 = 3，由于服务2和服务3没有依赖关系，因此可以并行加载，因此服务4启动需要的时间为4 + 4 = 8
// ```javascript
// function calcLaunchTime (arr, k) {}
// ```
function calcLaunchTime(arr, k) {
  function getTask(taskArr, index) {
    let res = -1;
    let others = [];
    for (let i = 0; i < taskArr.length; i++) {
      if (taskArr[i] > 0) {
        if (i !== index) {
          others.push(getTask(arr[i], i));
        } else {
          res = taskArr[i];
        }
      }
    }
    if (others.length) {
      return res + Math.max(...others);
    } else {
      return res;
    }
  }

  return getTask(arr[k - 1], k - 1);
}
console.log(
  calcLaunchTime(
    [
      [1, 0, 0],
      [1, 2, 0],
      [0, 1, 3],
    ],
    3
  )
);
console.log(
  calcLaunchTime(
    [
      [1, 0, 0, 0],
      [1, 2, 0, 0],
      [1, 0, 3, 0],
      [0, 1, 1, 4],
    ],
    4
  )
);

console.log(find("abc", "cabcabce", 1));
