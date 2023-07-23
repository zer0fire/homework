// function recursion(a, b = 0, c = 0) {}

function guessGame(num = 100) {
  let count = 0;

  for (let r = 0; r <= num; r++) {
    for (let c = 0; c <= num - r; c++) {
      let p = num - r - c;
      if ((r === c && r >= p) || (r === p && r >= c) || (c === p && c >= r)) {
        continue;
      } else {
        count += 1;
      }

      //   if (r > c) {
      //     if (p !== r) {
      //       count += 1;
      //     }
      //   } else if (r < c) {
      //     if (p !== c) {
      //       count += 1;
      //     }
      //   } else {
      //     if (p > r) {
      //       count += 1;
      //     }
      //   }
    }
  }
  return count;
}
// 4 12
// 6 24
// 100 5100

console.log(guessGame(100));

// 2 2 2
