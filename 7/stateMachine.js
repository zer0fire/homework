const EOF = Symbol("EOF");

const Result = {
  protocol: "",
  code: "",
  message: "",
};

function receiveHttpVersion(c) {
  Result.protocol += c;
}

function receiveHttpCode(c) {
  Result.code += c;
}

function receiveHttpText(c) {
  Result.message += c;
}

function start(input) {
  if (input === " ") {
    return statusCode;
  } else {
    receiveHttpVersion(input);
    return start;
  }
}

function statusCode(input) {
  if (input === " ") {
    return statusMessage;
  } else {
    receiveHttpCode(input);
    return statusCode;
  }
}

function statusMessage(input) {
  console.log("statusMessage: ", statusMessage);

  if (input === "\r") {
    return statusNext;
  } else {
    receiveHttpText(input);
    return statusMessage;
  }
}

function statusNext(input) {
  //   console.log("statusNext: ", statusNext);

  return statusNext;
}

class Parser {
  str = "";
  constructor() {
    this.state = start;
    this.store = Result;
  }

  write(data) {
    for (let i = 0; i < data.length; i++) {
      //   console.log(this.state.name, data, data[i], typeof data[i]);
      this.state = this.state(data[i].toString());
    }
    this.state(EOF);
    console.log(this.result.protocol, this.result.code, this.result.message);
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
