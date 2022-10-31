const { check } = require("../index");

describe("check", () => {
  test("integer", () => {
    expect(check("10")).toBe(true);
    expect(check("w10")).toBe(false);
    expect(check("0")).toBe(true);
    expect(check("0123")).toBe(false);
    expect(check("123")).toBe(true);
  });
  test("float", () => {
    expect(check(".123")).toBe(true);
    expect(check("1.123")).toBe(true);
    expect(check("10.123")).toBe(true);
    expect(check(".")).toBe(false);
    expect(check("0.")).toBe(true);
    expect(check(".0")).toBe(true);
  });
});
