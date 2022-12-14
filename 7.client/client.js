const net = require("node:net");
const Parser = require("./stateMachine");

const parser = new Parser();
// 利用 net 发送 http 请求格式
const client = net.createConnection({ port: 8000, host: "localhost" }, () => {
  // 第一行 request line
  //    * 请求方式 原则上可以写任何方式
  //    * 路径，一般写请求的路径即可，不用写全 url
  //    * 协议
  // 第二行 Host，Host 是响应主机地址，比如 Host: 127.0.0.1，必须对应 Host
  // 第三行开始时是 KV 对，Header
  // 中间可以有空行
  // 空行后面是 http body
  // 400 bad request
  // client.write(`GET / HTTP/1.1\r\n\r\n`);
  client.write(
    "GET / HTTP/1.1\r\n" +
      "Host: localhost\r\n" +
      //   "Content-Type: application/x-www-form-urlencoded\r\n" +
      "\r\n"
    //   "field1=aaa&code=x%3D1\r\n" +
    //   "\r\n"
    // `POST / HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/x-ww-form-urlencoded\r\n\r\nfield1=aaa&code=x%3D1\r\n\r\n`
  );
  client.end();
});
client.on("data", (data) => {
  // stream 断的地方不确定，所以需要用状态机来随时暂停开始
  //   console.log(data.toString());
  //   client.end();
  //   console.log("====data:", data);
  parser.write(data.toString());
  console.log(parser);
});
client.on("end", () => {
  console.log("disconnected from server");
});
