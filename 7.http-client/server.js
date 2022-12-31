// node: 是协议，明确是 node 本地包，
// 还有 file: http: https: data:
// data:text/html;utf-8,<p>abc</p>
const { Socket } = require("node:dgram");
const http = require("node:http");
const fs = require("node:fs");

// const readStream = fs.createReadStream(__dirname + "/sample/sample.txt");
const buffer = fs.readFileSync(__dirname + "/sample/index2.html");

// stream 流
// 写流
// write 写内容
//  end 表示结束

// Buffer 可以写东西，表示一段内容，一般就是用于写 stream
// string 也可以写进 stream，但是因为其不变

// stream 用事件读取数据，
// data 事件
// end 事件

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  // 任务：用 node 写一个 client 代替浏览器，让 server 能够正常工作
  // 写流
  // res.write("<div>hello winter</div>");
  // console.log(__dirname + "/sample/sample.txt");
  res.writeHead(200, { "Content-Type": "text/html" });
  // readStream.pipe(res);

  res.write(buffer.toString());
  res.write(buffer.toString());
  res.write(buffer.toString());
  // res.write(buffer.toString());
  // readStream.on("data", (data) => {
  //   res.write(data);
  // });
  // readStream.on("end", () => {
  //   // res.end();
  //   // 主请求不可能缓存，多次请求 Pipe 可能有问题
  //   console.log("request end");
  // });
  res.end();
});

server.on("clientError", (err, socket) => {
  // socket.end("HTTP/1.1 400 Bad request\r\n\r\n");
  console.log("error");
});

server.listen(8000);
console.log("server started");
