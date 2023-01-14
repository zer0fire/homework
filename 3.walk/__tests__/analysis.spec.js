const acorn = require("acorn");
const analysis = require("../analysis");

describe("analysis", () => {
  test("analysis 1", () => {
    const analysis = require("../analysis");
    // ast -> scope
    // 测试的时候要把各种声明，比如方法、变量声明，用例要测全测好测稳
    // 测试用例写个 util

    const code = `
const a = 1
function b () {
    const c = 2
}
function b () {
    const c = 'c'
    function g() {
        const h = 'h'
    }
}
for(let d = 1; d < 3; d++) {
    const e = 'e'
}
if (true) {
    let f = 1
}
`;
    const ast = acorn.parse(code, { ecmaVersion: 7 });
    const { root, allScope } = analysis(ast);

    console.log(JSON.stringify(root, null, 4), allScope.length);

    const child = allScope[1];

    const ifScope = allScope[5];

    expect(root.findDefiningScope("a")).toBe(root);
    expect(root.contains("a")).toEqual(true);

    expect(child.findDefiningScope("c")).toBe(child);
    expect(child.contains("c")).toBe(true);

    expect(child.findDefiningScope("a")).toBe(root);
    expect(child.contains("a")).toBe(true);

    expect(ifScope.contains("a")).toBe(true);
    // expect()
  });
});
