// HTTP/1.1 200 OK
// Date: Fri, 16 Dec 2022 13:10:43 GMT
// Connection: keep-alive
// Keep-Alive: timeout=5
// Content-Length: 0

// const Stream = require("node:stream");
const EOF = Symbol("EOF");
class Parser {
  // 可选：实现一个 write stream
  // write 和 end 必须实现。其他可以只实现而不用，目前用不到
  constructor() {
    this.state = this.start;
    this.protocol = "";
    this.code = "";
    this.message = "";
    this.header = {};
    this.currentHeaderKey = "";
    this.currentHeaderValue = "";
    this.body = "";
    this.bodyLength = "";
    this.messageNumber = "";
  }

  receiveHttpVersion(c) {
    this.protocol += c;
  }

  receiveHttpCode(c) {
    this.code += c;
  }

  receiveHttpText(c) {
    this.message += c;
  }

  start(input) {
    // console.log(input);
    if (input === " ") {
      return this.statusCode;
    } else {
      this.receiveHttpVersion(input);
      return this.start;
    }
  }

  statusCode(input) {
    if (input === " ") {
      return this.statusMessage;
    } else {
      this.receiveHttpCode(input);
      return this.statusCode;
    }
  }

  statusMessage(input) {
    // console.log("statusMessage: ", this.message);

    if (input === "\r") {
      return this.readLineFeed;
    } else {
      this.receiveHttpText(input);
      return this.statusMessage;
    }
  }

  readHeaderKey(input) {
    if (input === ":") {
      this.header[this.currentHeaderKey] = null;
      return this.readSpace;
    } else {
      this.currentHeaderKey += input;
      return this.readHeaderKey;
    }
  }

  statusNext(input) {
    return this.statusNext;
  }

  readHeaderValue(input) {
    if (input === "\r") {
      // cb  carriage back \n
      // cr  carriage return \r;
      // lf  line feed 进纸 \n
      this.header[this.currentHeaderKey] = this.currentHeaderValue;
      this.currentHeaderKey = "";
      this.currentHeaderValue = "";
      // console.log(this.header);
      return this.readLineFeed;
    } else {
      this.currentHeaderValue += input;
      return this.readHeaderValue;
    }
  }

  readLineFeed(input) {
    //   console.log("statusNext: ", statusNext);
    // return this.statusNext;
    if (input === "\n") {
      return this.checkEmptyLine;
    } else {
      throw new Error("error read LineFeed");
    }
  }

  checkEmptyLine(input) {
    if (input === "\r") {
      // body 的逻辑
      return this.readBody;
    } else {
      // reconsume
      return this.readHeaderKey(input);
    }
  }
  readBody(input) {
    return this.readLength;
  }

  readLength(input) {
    if (input === "\n") {
      return this.readContent;
    } else if (input === "\r") {
      return this.readLength;
    } else {
      this.bodyLength += input;
      return this.readLength;
    }
  }
  readContent(input) {
    if (input === "\r") {
      return this.readNumber;
    } else {
      this.body += input;
      return this.readContent;
    }
  }
  readNumber(input) {
    if (input === "\r") {
      return this.succeed;
    } else if (input === "\n") {
      return this.readNumber;
    } else {
      this.messageNumber += input;
      return this.readNumber;
    }
  }

  succeed() {
    return this.succeed;
  }

  readSpace(input) {
    if (input === " ") {
      return this.readHeaderValue;
    } else {
      throw new Error("error read space");
    }
  }

  write(data) {
    for (let i = 0; i < data.length; i++) {
      // console.log(this.state.name);
      // console.log(data[i]);
      this.state = this.state(data[i].toString());
    }
    console.log("========", this.protocol, this.code, this.message);
  }
  end() {
    this.state(EOF);
  }
}

module.exports = Parser;

// 文件相关，进程相关，流相关，http 相关
// 互相调的东西是高内聚，低耦合
// 模块直接互相调用的多才需要放在一块儿，如果没有互相调用，那还是别放在一块儿

// 架构师的类型
// 软件，工程，工程+软件
// 擅长高流量的，擅长模块的

// 不放到场景里很难想象，到底为什么这么做
// 里氏代换，凡用到子类的地方，都可以用基类代换，依赖倒置

// 模块本身需要外面调用的 api export 出去

// 状态机的分层
// 解析
// 最小公倍数
// \1

// 垃圾代码编译器
// babel
// 调试
