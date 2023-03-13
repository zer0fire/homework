const Module = require("../module");
describe("测试 Module", () => {
  describe("构造方法", () => {
    describe("imports", () => {
      it("单个import", () => {
        const code = `import {a as aa } from '../module'`;
        const module = new Module({ code });
        expect(module.imports).toEqual({
          aa: {
            localName: "aa",
            name: "a",
            source: "../module",
          },
        });
      });
      //   it("无别名", () => {
      //     const code = `import { a } from '../module'`;
      //     const module = new Module({ code });
      //     expect(module.imports).toEqual({
      //       a: {
      //         localName: "a",
      //         name: "a",
      //         source: "../module",
      //       },
      //     });
      //   });

      it("多个import", () => {
        const code = `import {a as aa ,b }  from '../module'`;
        const module = new Module({ code });
        expect(module.imports).toEqual({
          aa: {
            localName: "aa",
            name: "a",
            source: "../module",
          },
          b: {
            localName: "b",
            name: "b",
            source: "../module",
          },
        });
      });
    });

    describe("exports", () => {
      it("单个export", () => {
        const code = `export var a = 1`;
        const module = new Module({ code });
        expect(module.exports["a"].localName).toBe("a");
        expect(module.exports["a"].node).toBe(module.ast.body[0]);
        expect(module.exports["a"].expression).toBe(
          module.ast.body[0].declaration
        );
      });
      //   it("export default", () => {
      //     const code = `export default { a: 1}`;
      //     const module = new Module({ code });
      //     expect(module.exports["a"].localName).toBe("a");
      //     expect(module.exports["a"].node).toBe(module.ast.body[0]);
      //     expect(module.exports["a"].expression).toBe(
      //       module.ast.body[0].declaration
      //     );
      //   });
      //   it("多个 export", () => {
      //     const code = `export default { a: 1}`;
      //     const module = new Module({ code });
      //     expect(module.exports["a"].localName).toBe("a");
      //     expect(module.exports["a"].node).toBe(module.ast.body[0]);
      //     expect(module.exports["a"].expression).toBe(
      //       module.ast.body[0].declaration
      //     );
      //   });
    });

    describe("definitions", () => {
      it("单个变量", () => {
        const code = `const a = 1`;
        const module = new Module({ code });
        expect(module.definitions).toEqual({
          a: module.ast.body[0],
        });
      });
    });
  });

  describe("ExpandAllStatement", () => {
    //   it("基础", () => {
    //     const code = `const a = () =>  1;
    // const b = () => 2;
    // a();`;
    //     const module = new Module({ code });
    //     //   statements 包含了每一行代码
    //     const statements = module.expandAllStatement();
    //     // console.log(statements);
    //     expect(statements.length).toBe(2);
    //     expect(
    //       module.code.snip(statements[0].start, statements[0].end).toString()
    //     ).toEqual(`const a = () =>  1;`);
    //     expect(
    //       module.code.snip(statements[1].start, statements[1].end).toString()
    //     ).toEqual(`a();`);
    //   });
    it("console.log", () => {
      const code = `const a = () =>  1;
      const b = () => 2;
      console.log(a())`;
      const module = new Module({ code });
      //   statements 包含了每一行代码
      const statements = module.expandAllStatement();
      // console.log(statements);
      expect(statements.length).toBe(2);
    });
  });
});

// 如何讲 Rollup
// 1. 先从起点开始，分析起点，回顾过去，大致了解背景
// TreeShaking
// 2. 从头简略说明，大概总结，大致了解背景
