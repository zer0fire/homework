// 30, 8360

// 2 - 7

// 00 - 23
// 00 - 59
// 00 - 59
const map = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6];
function electronicClock(num) {
  let count = 0;
  for (let i = 0; i <= 23; i++) {
    let num1 = getCount(i);
    for (let j = 0; j <= 59; j++) {
      let num2 = getCount(j);
      for (let k = 0; k <= 59; k++) {
        let num3 = getCount(k);
        if (num1 + num2 + num3 === num) {
          count += 1;
        }
      }
    }
  }
  return count;
}

function getCount(num) {
  const str = num < 10 ? String(0) + String(num) : String(num);
  //   console.log(num);
  return map[str[0]] + map[str[1]];
}

console.log(electronicClock(30));

// TODO: 录视频，做一道 leetcode 的简单题
