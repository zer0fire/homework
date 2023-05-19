const vm = require("vm");

const ctx = { console };
vm.createContext(ctx, {
  microtaskMode: "afterEvaluate",
});

new Promise((resolve) => {
  console.log("hello1");
  resolve("world1");
}).then(console.log);
vm.runInContext(
  `new Promise(resolve => { console.log('hello2'); resolve('world2') }).then(console.log);`,
  ctx
);

vm.createContext(ctx, {
  microtaskMode: "afterEvaluate",
});

new Promise((resolve) => {
  console.log("hello1");
  resolve("world1");
}).then(console.log);
vm.runInContext(
  `new Promise(resolve => { console.log('hello2'); resolve('world2') }).then(c => console.log(c));`,
  ctx
);
