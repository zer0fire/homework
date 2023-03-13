const Bundle = require("../bundle");
const fs = require("fs");
const path = require("path");
jest.mock("fs"); //jest mockjs
afterEach(() => {
  fs.readFileSync.mock.calls = [];
  fs.writeFileSync.mock.calls = [];
});
describe("测试 Bundle", () => {
  // describe("fetchModule", () => {
  //   describe("主模块", () => {
  //     const bundle = new Bundle({ entry: "./a.js" });
  //     fs.readFileSync.mockReturnValueOnce("const a = 1");
  //     bundle.fetchModule("/index.js");
  //     const { calls } = fs.readFileSync.mock;
  //     //   console.log(calls[0][0]);
  //     expect(calls[0][0]).toEqual("/index.js");
  //   });
  //   describe("非主模块", () => {
  //     test("非主模块", () => {
  //       const bundle = new Bundle({ entry: "./a.js" });
  //       fs.readFileSync.mockReturnValueOnce("const a = 1");
  //       bundle.fetchModule("/index.js", "main.js");
  //       const { calls } = fs.readFileSync.mock;
  //       //   console.log(calls[0][0]);
  //       expect(calls[0][0]).toEqual("/index.js");
  //     });
  //     test("测试绝对路径", () => {
  //       const bundle = new Bundle({ entry: "./a.js" });
  //       fs.readFileSync.mockReturnValueOnce("const a = 1");
  //       bundle.fetchModule(
  //         "/Users/wangmeng/Documents/learning-frontend/rollup/lib/bundle.js",
  //         "main.js"
  //       );
  //       const { calls } = fs.readFileSync.mock;
  //       //   console.log(calls[0][0]);
  //       expect(calls[0][0]).toEqual(
  //         "/Users/wangmeng/Documents/learning-frontend/rollup/lib/bundle.js"
  //       );
  //     });
  //     test("测试相对路径", () => {
  //       const bundle = new Bundle({ entry: "./a.js" });
  //       fs.readFileSync.mockReturnValueOnce("const a = 1");
  //       const importee = path.resolve("./bundle.js");
  //       // console.log({ importee });
  //       bundle.fetchModule("../bundle.js", "./a/main.js");
  //       const { calls } = fs.readFileSync.mock;
  //       //   console.log(calls[0][0]);
  //       expect(calls[0][0]).toEqual(importee);
  //     });
  //   });
  // });

  describe("build", () => {
    // test("单条语句", () => {
    //   const bundle = new Bundle({ entry: "index.js" });
    //   // 模拟输入。fetchModule
    //   fs.readFileSync.mockReturnValueOnce("console.log(1)");
    //   bundle.build("build.js");
    //   // 测试输出
    //   const { calls } = fs.writeFileSync.mock;
    //   expect(calls[0][0]).toBe("build.js");
    //   expect(calls[0][1]).toBe("console.log(1)");
    // });
    //     test("多行语句+tree shaking", () => {
    //       const bundle = new Bundle({ entry: "index.js" });
    //       // 模拟输入。fetchModule
    //       fs.readFileSync.mockReturnValueOnce(`const a = () =>  1;
    // const b = () => 2;
    // console.log(a())
    // console.log(1);
    // console.log(2);
    // `);
    //       bundle.build("build.js");
    //       // 测试输出
    //       const { calls } = fs.writeFileSync.mock;
    //       expect(calls[0][0]).toBe("build.js");
    //       expect(calls[0][1]).toBe(`const a = () =>  1;
    // console.log(a())
    // console.log(1);
    // console.log(2);
    // `);
    //     });
    test("引入模块", () => {
      const bundle = new Bundle({ entry: "index.js" });
      // 模拟输入。fetchModule
      fs.readFileSync.mockReturnValueOnce(`import { a } from '../module';
a();`);
      fs.readFileSync.mockReturnValueOnce(`export const a = () => 1;`);
      bundle.build("build.js");
      // 测试输出
      const { calls } = fs.writeFileSync.mock;
      expect(calls[0][0]).toBe("build.js");
      // index.js + module.js
      expect(calls[0][1]).toBe(`const a = () => 1;
a();`);
    });
  });
});

// 中文 Fabric.js
// 中文字体 - 动态按需加载
