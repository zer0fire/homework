// 第一行 request line
//    * 请求方式 原则上可以写任何方式
//    * 路径，一般写请求的路径即可，不用写全 url
//    * 协议
// 第二行 Host，Host 是响应主机地址，比如 Host: 127.0.0.1，必须对应 Host
// 第三行开始时是 KV 对，Header
// 中间可以有空行
// 空行后面是 http body
// 400 bad request

const net = require("node:net");
const Parser = require("./stateMachine");

const parser = new Parser();
// 利用 net 发送 http 请求格式
const client = net.createConnection({ port: 8000, host: "localhost" }, () => {
  client.write("GET / HTTP/1.1\r\n" + "Host: localhost\r\n" + "\r\n");
  client.end();
});
client.on("data", (data) => {
  console.log("=====data", data.toString());
  // chunked 分块
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding
  // Transfer-Encoding: chunked
  // Transfer-Encoding: compress
  // Transfer-Encoding: deflate
  // Transfer-Encoding: gzip

  // // Several values can be listed, separated by a comma
  // Transfer-Encoding: gzip, chunked

  parser.write(data.toString());
  // console.log(parser);
  // console.log(data.toString());

  // http 构造
  // request
  // response
  // 状态码
  // 请求头、响应头
  // request line response line
  // header
  // 最小请求，最大请求
});
client.on("error", (err) => {
  console.error(err);
});
client.on("end", () => {
  console.log("disconnected from server");
});
