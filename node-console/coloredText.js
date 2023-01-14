// console.log("\033[4m\033[32m\033[5m Hello world!");

// console.log(`
// ░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓
// ┌──────────────────────┐
// │                      │
// │                      │
// └──────────────────────┘
// `);

// setTimeout(() => console.log("\033[1Ab"), 3000);
// console.log("a");
let str = "=>";
for (let i = 0; i < 40; i++) {
  setTimeout(() => {
    console.log("\033[2J\033[36m" + "=".repeat(i) + str);
  }, i * 100);
}

console.log(
  "This is %cMy stylish message",
  "color: yellow; font-style: italic; background-color: blue;padding: 2px"
);

console.log(
  "勇敢就是，在你还没开始的时候就知道自己注定会输，但依然义无反顾的去做，并且不管发生什么都坚持到底。一个人很少能赢，但也总会有赢的时候。 %c————————前端架构师卡颂",
  "text-align: right; margin: 10px"
);
console.log("%c————————前端架构师卡颂", "float: right;");
