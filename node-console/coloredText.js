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
