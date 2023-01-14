const { checkDec } = require("../index");

describe("check", () => {
  test("integer", () => {
    expect(checkDec("10")).toBe(true);
    expect(checkDec("w10")).toBe(false);
    expect(checkDec("0")).toBe(true);
    expect(checkDec("0123")).toBe(false);
    expect(checkDec("123")).toBe(true);
  });
  test("float", () => {
    expect(checkDec(".123")).toBe(true);
    expect(checkDec("1.123")).toBe(true);
    expect(checkDec("10.123")).toBe(true);
    expect(checkDec(".")).toBe(false);
    expect(checkDec("0.")).toBe(true);
    expect(checkDec(".0")).toBe(true);
  });
});
