// 模块与模块之间引用处理，imports exports definitions
const { walk, Scope, analysis, MagicString } = require("../../3.walk/index.js");
const { parse } = require("acorn");
// import
// export
// definitions
class Module {
  constructor(code) {
    this.ast = parse(code, { ecmaVersion: 7, sourceType: "module" });
    this.analyze();
  }
  analyze() {
    this.imports = {};
    this.ast.body.forEach((node) => {});
  }
}

module.exports = Module;
