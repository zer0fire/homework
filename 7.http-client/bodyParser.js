const HTMLParser = require("./htmlParser");

class ChunkedBodyParser {
  constructor() {
    this.state = this.readLength;
    this.chunkLength = "";
    this.content = "";
    this.length = 0;
    this.htmlParser = new HTMLParser();
  }
  waitForR(input) {
    if (input === "\n") {
      return this.readContent;
    }
  }
  readLength(input) {
    if (input === "\r") {
      this.length = parseInt(this.chunkLength, 16);
      //   console.log(parseInt(this.chunkLength, 16));
      return this.waitForR;
    } else {
      this.chunkLength += input;
      return this.readLength;
    }
  }
  readContent(input) {
    this.length--;
    if (this.length === -1) {
      this.chunkLength = "";
      //   console.log(this.content);
      //   return this.readLength;
      return this.readLength;
    } else {
      //   console.log(input);
      // 怎么用 buffer 传递 write 去写入

      this.htmlParser.write(input);
      return this.readContent;
    }
  }
  write(data) {
    for (let i = 0; i < data.length; i++) {
      // console.log(this.state.name);
      // console.log(data[i]);
      this.state = this.state.call(this, data[i].toString());
    }
  }
  end() {}
}

module.exports = ChunkedBodyParser;
