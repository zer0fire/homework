const { strStr } = require("../../kmp/kmpState");
describe("parse HTML", () => {
  // 串里找串
  test("not repeat", () => {
    expect(strStr("asadbutted", "sad")).toBe(1);
  });
  test("repeat", () => {
    expect(strStr("asdfasdfsafabababafabababacasdf", "ababac")).toBe(21);
    expect(strStr("mississippi", "issip")).toBe(4);
    expect(strStr("abababcdef", "ababc")).toBe(2);
  });
  // 需要 i 回退
});
