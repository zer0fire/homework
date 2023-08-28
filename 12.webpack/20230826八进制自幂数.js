// 100000 以下
function findArmstrong(N) {
  let arr = [];
  for (let i = N; i < 17000; i++) {
    let str = i.toString(N);
    let len = str.length;
    // 每一位相加
    let res = str.split("").reduce((r, item) => {
      return r + Number(item) ** len;
    }, 0);

    if (res === i) {
      arr.push(str);
    }
  }
  return arr;
}

module.exports = {
  findArmstrong,
};
