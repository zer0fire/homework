// node: 是协议，明确是 node 本地包，
// 还有 file: http: https: data:
// data:text/html;utf-8,<p>abc</p>
const { Socket } = require("node:dgram");
const http = require("node:http");

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
  res.write("<div>hello winter</div>");
  res.end();
});

server.on("clientError", (err, socket) => {
  socket.end("HTTP/1.1 400 Bad request\r\n\r\n");
});

server.listen(8000);
console.log("server started");
