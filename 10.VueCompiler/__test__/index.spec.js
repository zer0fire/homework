import { add } from "../src/index";

describe("jest test", () => {
  test("foo", () => {
    expect(add(1, 1)).toBe(2);
  });
});
