const Module = require("../src/module");

describe("测试 Module", () => {
  describe("构造方法", () => {
    describe("imports", () => {
      it("单个 import", () => {
        const code = `import { a as aa } from '../module'`;
        const module = new Module({ code });
        expect(module.imports).toEqual({
          a: {
            localName: "aa",
            name: "a",
            source: "../module",
          },
        });
        // 为了应付解构赋值等等
      });
    });
  });
});
