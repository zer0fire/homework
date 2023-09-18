function spiralText(width, text) {
  let arr = new Array(width).fill(0).map((it) => {
    return new Array(width).fill(" ");
  });

  let i = 0,
    j = 0;

  let method1 = () => (j += 1);
  let method2 = () => (i += 1);
  let method3 = () => (j -= 1);
  let method4 = () => (i -= 1);
  let nextFunc = method1;

  function switchFunc() {
    if (nextFunc === method4) {
      // right
      i += 1;
      nextFunc = method1;
    } else if (nextFunc === method1) {
      // down
      j -= 1;
      nextFunc = method2;
    } else if (nextFunc === method2) {
      // left
      i -= 1;
      nextFunc = method3;
    } else if (nextFunc === method3) {
      // up
      j += 1;
      nextFunc = method4;
    }
    nextFunc();
  }

  for (let x = 0; x < text.length; x++) {
    const char = text[x];
    if (!arr[i] || arr[i][j] !== " ") {
      switchFunc();
      if (arr[i][j] !== " ") {
        break;
      }
    }
    arr[i][j] = char;
    nextFunc();
  }

  return arr.map((it) => it.join("")).join("\n");
}

// 0  1  2  3 4
//            5
//            6
//            7
// 12 11 10 9 8

// 0  1  2  3 4
// 5  6  7  8 9
//            14
//            19
// 20 21 22 23 24

console.log(spiralText(5, "abcdefghijklmnopqrstuvwxyzzzzzzzzzzzzzzzzzzzz"));
