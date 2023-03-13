const fs = require("fs");
const path = require("path");
const Module = require("./module");
const MagicString = require("magic-string");
// 多模块打包
// ast;
module.exports = class Bundle {
  constructor({ entry }) {
    this.entryPath = entry.replace("");
    this.modules = [];
    this.statements = [];
  }
  /**
   * 读取模块构建 Module对象链表
   * @param {*} importee 被调用的模块
   * @param {*} importer 调用模块
   * @description main.js 导入 foo.js importee: foo importer main.js
   * @returns 模块实例
   */
  fetchModule(importee, importer) {
    // const route = importee; // 入口文件的绝对路径
    // 没有斜杠的应该报错
    let route = importee;
    if (!importer) {
      // 没有入口说明 主模块
      route = importee;
    } else {
      // 路径处理
      if (path.isAbsolute(importee)) {
        route = importee;
      } else if (importee[0] == ".") {
        // 相对路径
        // 计算相对于导入者的绝对路径
        route = path.resolve(
          path.dirname(importer),
          importee.replace(/\.js$/, "") + ".js"
        );
        // json
      }
    }
    if (route) {
      // 读代码
      const code = fs.readFileSync(route, "utf-8").toString();
      // console.log({ name: "module", code });
      const module = new Module({
        code,
        path: route, // 模块的绝对路径
        bundle: this, // 上下文
      });
      return module;
    } else {
      // 使用 node_module 或者 npm 的 api？
      // 直接读取对应目录下的导出文件内容，并且拼合代码？
    }
  }
  build(bundleName) {
    // this.entryPath
    const entryModule = this.fetchModule(this.entryPath);
    this.statements = entryModule.expandAllStatement();
    const { code } = this.generate();
    // console.log(code);
    // StringBuffer 不要频繁操作堆内存
    // console.log({ code });
    // 输出
    fs.writeFileSync(bundleName, code, "utf-8");
  }
  /**
   * 生成代码
   * @returns 代码字符串
   */
  // 操作 bundle 的 code，让 import 和 export 的代码加进来
  generate() {
    // 合成，把所有的返回的 statement 合成，比如两个模块，只会返回 export 和使用的地方，import 被删除了
    const magicString = new MagicString.Bundle();
    this.statements.forEach((statement) => {
      // MagicString
      const source = statement._source.clone();
      // Export 的部分删除，添加到 this.code 上
      if (statement.type === "ExportNamedDeclaration") {
        source.remove(statement.start, statement.declaration.start);
      }
      // 合成最终的 magicString
      magicString.addSource({
        content: source,
        separator: "\n",
      });
    });
    return { code: magicString.toString() };
  }
};
