const { parseHTML } = require("../parseHTML");

describe("parse HTML", () => {
  test("normal node", () => {
    expect(parseHTML("<div></div>")).toBe(true);
  });
  test("text node", () => {});
  test("comment node", () => {});
  test("CDATA node", () => {});
  test("ProcessingInstruction node", () => {});
  test("DocumentType node", () => {});
});
