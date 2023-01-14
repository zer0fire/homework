const { analyze } = require("../src/index");

describe("walk", () => {
  test("输出变量声明", () => {
    const code = `
const a = () => 'a'
const b = () => 'b'
const c = () => 'c'
a()
    `;
    const ast = analyze(code);
    expect(ast._defines).toEqual({
      // _defines
      a: true,
      b: true,
      c: true,
    });
  });

  test("嵌套变量", () => {
    const code = `const a = () => 'a';
      function f() {
        const b = () => 'b'
      }
      `;

    const ast = analyze(code);
    // console.log("ast._scope", ast._scope);
    expect(ast._scope.contains("a")).toBe(true);
    expect(ast._scope.findDefiningScope("a")).toEqual(ast._scope);
    expect(ast._scope.contains("f")).toBe(true);
    expect(ast._scope.findDefiningScope("f")).toEqual(ast._scope);
    console.log(ast.body[1]);
    expect(ast.body[1]._scope.contains("b")).toBe(true);
    expect(ast.body[1]._scope.findDefiningScope("f")).toEqual(ast._scope);
    expect(ast.body[1]._scope.findDefiningScope("b")).toEqual(
      ast.body[1]._scope
    );
    // expect(ast.body[0]._defines).toEqual({ a: true }); // 全局变量定义
    // expect(ast.body[1]._defines).toEqual({ f: true }); // 全局变量定义
  });
});
