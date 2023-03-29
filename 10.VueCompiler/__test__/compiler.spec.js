import { parse } from "../src/compiler/parse";

describe("compiler", () => {
  it("parse element", () => {
    const template = "<div></div>";
    const ast = parse(template);
    expect(ast[0]).toEqual({
      tag: "div",
      type: "Element",
      children: [],
      isUnary: false,
    });
  });
});
