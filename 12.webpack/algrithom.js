/**
 * 四则运算 - 暴力解答
 * 随机给四位数，可以加入四则运算，最终得到输入的回文
 * 比如  1234 -> ?? = 4321
 * 找出可以符合四则运算回文的数字
 * 范围 1000 - 9999
 */

// 1 (+-*/ ) 2 (+-*/ ) 3 (+-*/ ) 4
// 排列组合
function arithmetic() {
  for (let i = 1000; i <= 9999; i++) {
    if (hasArithmetic(i)) {
      console.log(i);
      return { i };
    }
  }
}

function hasArithmetic(number) {
  let arr = String(number).split("");
  let reverse = arr.reverse().join("");
  // 遍历 +-*/
  let opt = ["+", "-", "*", "/", ""];
  // arr[0]
  //   label: first;
  for (let l = 0; l < opt.length; l++) {
    // arr[1]
    for (let m = 0; m < opt.length; m++) {
      // arr[2]
      for (let n = 0; n < opt.length; n++) {
        // arr[3]
        if (opt[l] === "" && opt[m] === "" && opt[n] === "") {
          continue;
        }
        const re = `(${arr[0]}${opt[l]}${arr[1]}${opt[m]}${arr[2]}${opt[n]}${arr[3]})%1e9+7`;
        let res = eval(re);
        console.log({ re, res, reverse, arr });
        if (String(res) === String(reverse)) {
          return true;
        }
      }
    }
  }
  return false;
}

arithmetic();
