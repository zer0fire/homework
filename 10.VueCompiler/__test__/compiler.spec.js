import { parse, generate } from "../src/compiler";
// import { generate } from "../src/compiler/generate2";

describe("compiler", () => {
  it("parse element", () => {
    const template = "<div><img/></div>";
    const ast = parse(template);
    expect(ast[0]).toEqual({
      tag: "div",
      type: "Element",
      props: [],
      children: [
        {
          tag: "img",
          type: "Element",
          props: [],
          children: [],
          isUnary: true,
        },
      ],
      isUnary: false,
    });
  });
  it("parse element unary", () => {
    const template = "<div></div>";
    const ast = parse(template);
    expect(ast[0]).toEqual({
      tag: "div",
      type: "Element",
      props: [],
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
      props: [],
      children: [
        {
          tag: "p",
          type: "Element",
          props: [],
          children: [],
          isUnary: false,
        },
      ],
      isUnary: false,
    });
  });
  it("parse props and directive", () => {
    const template = '<div id="foo" v-show="isShow" disable></div>';
    const ast = parse(template);
    expect(ast[0]).toEqual({
      tag: "div",
      type: "Element",
      props: [
        {
          type: "Attribute",
          name: "id",
          value: "foo",
        },
        {
          type: "Attribute",
          name: "v-show",
          value: "isShow",
        },
        {
          type: "Attribute",
          name: "disable",
          value: true,
        },
      ],
      children: [],
      isUnary: false,
    });
  });
  it("parse plain text", () => {
    const template = '<div id="some">some text</div>';
    const ast = parse(template);
    expect(ast[0]).toEqual({
      tag: "div",
      type: "Element",
      props: [
        {
          type: "Attribute",
          name: "id",
          value: "some",
        },
      ],
      children: [
        {
          type: "Text",
          content: "some text",
        },
      ],
      isUnary: false,
    });
  });
  it("parse interpolation", () => {
    const template = "<div>{{foo}}</div>";
    const ast = parse(template);
    expect(ast[0]).toEqual({
      tag: "div",
      type: "Element",
      props: [],
      children: [
        {
          type: "Interpolation",
          content: {
            type: "Expression",
            content: "foo",
          },
        },
      ],
      isUnary: false,
    });
  });
  it("parse multi interpolation", () => {
    const template = "<div>{{foo}}{{bar}}</div>";
    const ast = parse(template);
    expect(ast[0]).toEqual({
      tag: "div",
      type: "Element",
      props: [],
      children: [
        {
          type: "Interpolation",
          content: {
            type: "Expression",
            content: "foo",
          },
        },
        {
          type: "Interpolation",
          content: {
            type: "Expression",
            content: "bar",
          },
        },
      ],
      isUnary: false,
    });
  });
  it("parse text and interpolation", () => {
    const template = '<div id="some">some text{{foo}}</div>';
    const ast = parse(template);
    expect(ast[0]).toEqual({
      tag: "div",
      type: "Element",
      props: [
        {
          type: "Attribute",
          name: "id",
          value: "some",
        },
      ],
      children: [
        {
          type: "Text",
          content: "some text",
        },
        {
          type: "Interpolation",
          content: {
            type: "Expression",
            content: "foo",
          },
        },
      ],
      isUnary: false,
    });
  });
  it("parse text and interpolation and after interpolation text", () => {
    const template = '<div id="some">some text{{foo}}some text2</div>';
    const ast = parse(template);
    expect(ast[0]).toEqual({
      tag: "div",
      type: "Element",
      props: [
        {
          type: "Attribute",
          name: "id",
          value: "some",
        },
      ],
      children: [
        {
          type: "Text",
          content: "some text",
        },
        {
          type: "Interpolation",
          content: {
            type: "Expression",
            content: "foo",
          },
        },
        {
          type: "Text",
          content: "some text2",
        },
      ],
      isUnary: false,
    });
  });

  it("generate element with text", () => {
    const ast = [
      {
        type: "Element",
        tag: "div",
        props: [],
        isUnary: false,
        children: [{ type: "Text", content: "foo" }],
      },
    ];
    const code = generate(ast);
    expect(code).toMatch(`return this._c('div',null,'foo')`);
  });
  it("generate element has id prop", () => {
    const ast = [
      {
        type: "Element",
        tag: "div",
        props: [
          {
            type: "Attribute",
            name: "id",
            value: "some",
          },
        ],
        isUnary: false,
        children: [{ type: "Text", content: "foo" }],
      },
    ];
    const code = generate(ast);
    expect(code).toMatch(`return this._c('div',{'id':'some'},'foo')`);
  });
  it("generate element with expression", () => {
    const ast = [
      {
        type: "Element",
        tag: "div",
        props: [],
        isUnary: false,
        children: [
          {
            type: "Interpolation",
            content: { type: "Expression", content: "foo" },
          },
        ],
      },
    ];
    const code = generate(ast);
    expect(code).toMatch(`return this._c('div',null,this.foo)`);
  });
  it("generate element with muti children", () => {
    const ast = [
      {
        type: "Element",
        tag: "div",
        props: [],
        isUnary: false,
        children: [
          { type: "Text", content: "foo" },
          {
            type: "Element",
            tag: "span",
            props: [],
            isUnary: false,
            children: [{ type: "Text", content: "bar" }],
          },
        ],
      },
    ];
    const code = generate(ast);
    expect(code).toMatch(
      `return this._c('div',null,[this._v('foo'),this._c('span',null,'bar')])`
    );
  });
});
