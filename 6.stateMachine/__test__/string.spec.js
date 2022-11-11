const { findSubstr } = require("../string");

describe("parse HTML", () => {
  test("normal node", () => {
    // 串里找串
    expect(findSubstr("abcdefghijklmn", "defg")).toBe(3);
    expect(findSubstr("abcdefghijklmn", "ba")).toBe(-1);
  });
  // 如果 pattern 里完全没有重复
});
