import { parse } from "../src/compiler/parse";

describe("compiler", () => {
  it("parse element", () => {
    const template = "<div><img/></div>";
    const ast = parse(template);
    expect(ast[0]).toEqual({
      tag: "div",
      type: "Element",
      children: [],
      isUnary: false,
    });
  });
  it("parse element unary", () => {
    const template = "<div></div>";
    const ast = parse(template);
    expect(ast[0]).toEqual({
      tag: "div",
      type: "Element",
      children: [],
      isUnary: false,
    });
  });
  it("parse element children", () => {
    const template = "<div><p></p></div>";
    const ast = parse(template);
    expect(ast[0]).toEqual({
      tag: "div",
      type: "Element",
      children: [],
      isUnary: false,
    });
  });
  // it("parse props and directive", () => {
  //   const template = '<div id="foo" v-show="isShow"></div>';
  //   const ast = parse(template);
  //   expect(ast[0]).toEqual({
  //     tag: "div",
  //     type: "Element",
  //     props: [
  //       {
  //         type: "Attribute",
  //         name: "id",
  //         value: "foo",
  //       },
  //       {
  //         type: "Attribute",
  //         name: "v-show",
  //         value: "isShow",
  //       },
  //     ],
  //     children: [],
  //     isUnary: false,
  //   });
  // });
  // it("parse plain text", () => {
  //   const template = "<div>some text</div>";
  //   const ast = parse(template);
  //   expect(ast[0]).toEqual({
  //     tag: "div",
  //     type: "Element",
  //     props: [],
  //     children: [
  //       {
  //         type: "Text",
  //         content: "some text",
  //       },
  //     ],
  //     isUnary: false,
  //   });
  // });
  // it("parse interpolation", () => {
  //   const template = "<div>{{foo}}</div>";
  //   const ast = parse(template);
  //   expect(ast[0]).toEqual({
  //     tag: "div",
  //     type: "Element",
  //     props: [],
  //     children: [
  //       {
  //         type: "Interpolation",
  //         content: {
  //           type: "Expression",
  //           content: "foo",
  //         },
  //       },
  //     ],
  //     isUnary: false,
  //   });
  // });
});
