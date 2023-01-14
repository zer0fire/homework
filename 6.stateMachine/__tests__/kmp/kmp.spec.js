const {
  search,
  search2,
  search3,
  genNext,
  genNext3,
} = require("../../kmp/kmp");
describe("parse HTML", () => {
  // 串里找串
  test("not repeat", () => {
    // 如果 pattern 里完全没有重复
    // expect(search2("abcdefghijklmn", "defg")).toBe(3);
    // expect(search2("abcdefghijklmn", "ba")).toBe(-1);
    // expect(search2("abcdefghijklmn", "ba")).toBe(-1);
    // expect(search2("abcdefghijklmn", "fg")).toBe(5);
    // expect(search2("abcdefghijklmn", "def")).toBe(3);
    // expect(search2("mississippi", "issip")).toBe(4);
  });
  test("repeat", () => {
    // 如果串里有重复
    // expect(findSubstr("aabcdabcddefghijklmn", "abcd")).toBe(1);
    // expect(findSubstr("ababc", "abc")).toBe(2);
    // expect(findSubstr("abababc", "abc")).toBe(4);
    // expect(findSubstr("ababc", "abc")).toBe(2);
    // 串的一部分在前一个串里
    // expect(findSubstr("mississippi", "issip")).toBe(4);
    // expect(search3("abababc", "ababc")).toBe(2);
    // expect(search3("asdaabaabx", "aabaabx")).toBe(3);
    // expect(search3("asdaabaabx", "aabaabx")).toBe(3);
    // expect(genNext3("aabaabaaab")).toEqual([0, 0, 1, 0, 1, 2, 3, 4, 5, 2, 3]);
  });
  // 需要 i 回退
});
