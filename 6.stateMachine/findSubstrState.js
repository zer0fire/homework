function start(input) {
  if (input === "d") {
    return findD;
  } else {
    return fail;
  }
}
function findD(input) {
  if (input === "e") {
    return findE;
  } else {
    return fail;
  }
}
function findE(input) {
  if (input === "f") {
    return findF;
  } else {
    return fail;
  }
}
function findF(input) {
  if (input === "g") {
    return findG;
  } else {
    return fail;
  }
}
function findG(input) {
  return success;
}

// findSubstr("abcdefghijklmn", "defg");

// state 是一个可以转移的状态，那么如果 fail 就重新开始
// pattern[j] source[i] 本身是一个比对过程，
// 需要 source[i] 进状态机
// 如果 fail ，那么说明需要重置，j = 0
// 如果没 fail，那么说明需要继续比，需要生成新状态
// 直到循环结束，j === pattern.length 其实就说明成功，
// 相当于我们状态机运行到最后一个状态，相当于成功
// 否则 i 循环结束，返回 -1

function findSubstr(source, pattern) {
  // abcdefghijklmn
  // defg
  // 首先先找到 source 里 pattern 第一位的位置，然后循环，看后面的是不是也一致
  // 只变 j

  let state;

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
        i++;
        console.log(i, j);
      }
    } else {
      // pattern 进 1
      j++;
      state = function (input) {
        if (input === pattern[j]) {
          return findD;
        } else {
          return fail;
        }
      };
    }
    if (j === pattern.length) {
      // 过去的 length 被减掉
      return i - pattern.length + 1;
    }
  }
  return -1;
}
