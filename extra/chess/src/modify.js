const fs = require("fs");
const path = require("path");

const genStr = (index) => {
  //   return ` ${index}. Qd6 Kf7 ${index + 1}. Qd5+ Ke8`;
  return ` ${index}. Qd5 Kf8 ${index + 1}. Qd4 Ke8`;
};

function main() {
  const buffer = fs.readFileSync(path.join(process.cwd(), "./src/3.pgn"));
  let str = buffer.toString();
  for (let i = 3; i < 10000; i += 2) {
    str += genStr(i);
  }
  fs.writeFileSync(path.join(process.cwd(), "./src/3.pgn"), str);
}
main();
// 10000 400ms
// 100000 4s
