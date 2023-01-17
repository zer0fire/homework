const { analyze } = require("../src/index.js");
const MagicString = require("magic-string");
const acorn = require("acorn");
function getCode(code) {
  const ast = acorn.parse(code, {
    locations: true,
    ranges: true,
    sourceType: "module",
    ecmaVersion: 7,
  });
  console.log(new MagicString(code));
  return {
    ast,
    magicString: new MagicString(code),
  };
}

describe("walk", () => {
  test("输出变量声明", () => {
    const code = `
const a = () => 'a'
const b = () => 'b'
const c = () => 'c'
a()
    `;
    const { ast, magicString } = getCode(code);

    analyze(ast);
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

    const { ast, magicString } = getCode(code);

    analyze(ast);
    expect(ast._scope.contains("a")).toBe(true);
    expect(ast._scope.findDefiningScope("a")).toEqual(ast._scope);
    expect(ast._scope.contains("f")).toBe(true);
    expect(ast._scope.findDefiningScope("f")).toEqual(ast._scope);
    expect(ast.body[1]._scope.contains("b")).toBe(true);
    expect(ast.body[1]._scope.findDefiningScope("f")).toEqual(ast._scope);
    expect(ast.body[1]._scope.findDefiningScope("b")).toEqual(
      ast.body[1]._scope
    );
    expect(ast.body[0]._defines).toEqual({ a: true }); // 全局变量定义
    expect(ast.body[1]._defines).toEqual({ f: true }); // 全局变量定义
  });
});
