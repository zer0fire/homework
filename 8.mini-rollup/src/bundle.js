const fs = require("fs");
const path = require("path");
// 多模块打包
// ast;
module.exports = class Bundle {
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
      //   const module = new Module({
      //     code,
      //     path: route, // 模块的绝对路径
      //     bundle: this, // 上下文
      //   });
      //   return module;
    } else {
      // TODO: 第三方库导入 目前不支持
    }
  }
};
