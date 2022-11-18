const { parseHTML, checkHTML } = require("../parseHTML");

describe("parse HTML", () => {
  test("normal node", () => {
    // expect(parseHTML("<div></div>")).toBe(true);
    // expect(parseHTML(" <div>  </div>")).toBe(true);
    // expect(parseHTML(" <div  >  </div >")).toBe(true);
    // expect(parseHTML(" < div  >  </div >")).toBe(false);
    // expect(parseHTML(" <div  >  < /div >")).toBe(false);
    // expect(parseHTML(" <div  >  </ div >")).toBe(false);
    expect(checkHTML("<div><span>123</span></div>")).toBe(true);
  });
  test("text node", () => {});
  test("comment node", () => {});
  test("CDATA node", () => {});
  test("ProcessingInstruction node", () => {});
  test("DocumentType node", () => {});
});

// 每个人都在做重复的单测，只是没有管理，而且人肉断言
