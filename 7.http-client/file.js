const fs = require("node:fs");

// Create a stream from some character device.
const readStream = fs.createReadStream(__dirname + "/sample/sample.txt");
const writeStream = fs.createWriteStream(__dirname + "/sample/sample2.txt");

// 读 + 写
// readStream.on("data", (data) => {
//   writeStream.write(data.toString());
// });
// readStream.on("end", () => {
//   writeStream.end();
//   console.log("=============end================");
// });

// 等价于
readStream.pipe(writeStream);
