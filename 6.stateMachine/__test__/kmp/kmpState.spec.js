const { strStr } = require("../../kmp/kmpState");
describe("parse HTML", () => {
  // 串里找串
  test("not repeat", () => {
    // expect(strStr("sadbutted", "sad")).toBe(0);
  });
  test("repeat", () => {
    // expect(strStr("mississippi", "issip")).toBe(0);
    expect(strStr("abababcdef", "ababc")).toBe(2);
  });
  // 需要 i 回退
});
