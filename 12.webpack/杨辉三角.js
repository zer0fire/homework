// 1
// n = 45, res = ?
// res 是最少组成的硬币
// 杨辉三角
// 凑出硬币
// 1 5 10 50 100 500 1000 2000 5000 10000

//     1            n=0
//    1 1           n=1
//   1 2 1          n=2
//  1 3 3 1         n=3
// 1 4 6 4 1        n=4

// 1
// 1 1
// 1 2 1
// 1 3 3 1
// 1 4 6 4 1
// 1 5 10 10 5 1
// 1 6 15 20 15 6 1
// 1 7 21 35 35 21 7 1
// 1 8 28 56 70 56 28 8 1
// 1 9 36 84 126 126 84 36 9 1
// 1 10 45 120 210 252 210 120 45 10 1

function triangle(n) {
  let result = [[1], [1, 1]];
  for (let i = 2; i <= n; i++) {
    // 头
    let cache = [1];
    // i === 2, count === 1
    const count = i - 1;
    for (let j = 0; j < count; j++) {
      // result[i - 1] === [1, 1]
      const lastRes = result[i - 1];
      //   cache.length = 1, 0 1
      const compute = lastRes[cache.length - 1] + lastRes[cache.length];
      cache.push(compute);
    }
    // 尾
    cache.push(1);
    result.push(cache);
  }
  return result;
}

function getTriangle2(n, log) {
  let res = [1];
  for (let i = 0; i < n; i++) {
    const cache = [1];
    for (let j = 1; j < i + 1; j++) {
      const n1 = res[j - 1] || 0;
      const n2 = res[j] || 0;
      const num = n1 + n2;
      cache.push(num);
    }
    cache.push(1);
    res = cache;
  }
  return res;
}

function log(result) {
  // 1. 空格
  result.forEach((v, i) => {
    console.log(`${" ".repeat(result.length - 1 - i)}${v.join(" ")}`);
  });
}

// log(triangle(10));
// console.log(getTriangle2(4));

function getMoney(result) {
  // 500 100 50 60 5 1
  const money = [10000, 5000, 2000, 1000, 500, 100, 50, 10, 5, 1];
  let count = 0;
  for (let m of money) {
    // console.log({ m });
    if (result >= m) {
      while (result >= 0) {
        result -= m;
        if (result >= 0) {
          count++;
          //   console.log({ result });
        }
      }
      result += m;
    }
  }
  return count;
}

function getMoney2(res = 666) {
  const money = [10000, 5000, 2000, 1000, 500, 100, 50, 10, 5, 1];
  let count = 0;
  for (const m of money) {
    if (res % m !== res) {
      const num = Math.floor(res / m);
      res -= m * num;
      count += num;
    }
  }
  return count;
}

console.log(
  getTriangle2(45).reduce((res, it) => {
    return (res += getMoney2(it));
  }, 0)
  //   getMoney2()
);
// TODO: 找一道对味儿的，暴力解解题的题
// 10 分钟一道题、猜拳、杨辉三角
