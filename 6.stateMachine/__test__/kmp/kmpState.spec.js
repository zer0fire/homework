const { strStr } = require("../../kmp/kmpState");
describe("parse HTML", () => {
  // 串里找串
  test("not repeat", () => {
    expect(strStr("sadbutted", "sad")).toBe(0);
    // 如果 pattern 里完全没有重复
    // expect(search("abcdefghijklmn", "defg")).toBe(3);
    // expect(search("abcdefghijklmn", "ba")).toBe(-1);
    // expect(search("abcdefghijklmn", "ba")).toBe(-1);
    // expect(search("abcdefghijklmn", "fg")).toBe(5);
    // expect(search("abcdefghijklmn", "def")).toBe(3);
  });
  test("repeat", () => {
    // expect(search("mississippi", "issip")).toBe(4);
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
    // console.log(genNext("ababcaabc"));
    // expect(search("ababcaababcaabc", "ababcaabc")).toBe(6);
    // expect(genNext("aabaabaaab")).toEqual([0, 0, 1, 0, 1, 2, 3, 4, 5, 2, 3]);
  });
  // 需要 i 回退
});
