import { transform } from "../src/compiler/vue3compile/transform";
import { compile } from "../src/compiler/vue3compile/compile";
import { parse } from "../src/compiler/parse";

describe("测试 transform html ast to js ast", () => {
  it("html code to js ast", () => {
    const originAst = parse(`<div><p>Vue</p><p>Template</p></div>`);
    const wrapperAst = {
      type: "Root",
      children: originAst,
    };
    transform(wrapperAst);
    const FunctionDeclNode = {
      type: "FunctionDecl",
      id: {
        type: "Identifier",
        name: "render",
      },
      params: [],
      body: [
        {
          type: "ReturnStatement",
          return: {
            type: "CallExpression",
            callee: { type: "Identifier", name: "h" },
            arguments: [
              { type: "StringLiteral", value: "div" },
              {
                type: "ArrayExpression",
                elements: [
                  {
                    type: "CallExpression",
                    callee: { type: "Identifier", name: "h" },
                    arguments: [
                      { type: "StringLiteral", value: "p" },
                      { type: "StringLiteral", value: "Vue" },
                    ],
                  },
                  {
                    type: "CallExpression",
                    callee: { type: "Identifier", name: "h" },
                    arguments: [
                      { type: "StringLiteral", value: "p" },
                      { type: "StringLiteral", value: "Template" },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    };
    expect(wrapperAst.jsNode).toEqual(FunctionDeclNode);
  });
  it("html code to js code", () => {
    const jsCode = `function render() {
    return h('div', [h('p', 'Vue'), h('p', 'Template')])
}`;
    const htmlCode = `<div><p>Vue</p><p>Template</p></div>`;
    const res = compile(htmlCode);
    expect(res).toEqual(jsCode);
  });
});
