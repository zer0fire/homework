const { findSubstr } = require("../string");

describe("parse HTML", () => {
  // 串里找串
  test("not repeat", () => {
    // 如果 pattern 里完全没有重复
    expect(findSubstr("abcdefghijklmn", "defg")).toBe(3);
    expect(findSubstr("abcdefghijklmn", "ba")).toBe(-1);
    expect(findSubstr("abcdefghijklmn", "ba")).toBe(-1);
    expect(findSubstr("abcdefghijklmn", "fg")).toBe(5);
  });
  test("repeat", () => {
    // 如果串里有重复
    // expect(findSubstr("aabcdabcddefghijklmn", "abcd")).toBe(1);
    // expect(findSubstr("ababc", "abc")).toBe(2);
    // expect(findSubstr("abababc", "abc")).toBe(4);
    // expect(findSubstr("ababc", "abc")).toBe(2);
    expect(findSubstr("mississippi", "issip")).toBe(4);
  });
  // 需要 i 回退
});
