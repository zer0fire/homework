import { compile } from "../src/compiler";

const context = {
  _c: function (tag, props, children) {
    return {
      tag,
      props,
      children,
    };
  },
  _v: function () {
    return {};
  },
};

describe("compile test", () => {
  test("compile transform", () => {
    const template = "<div>foo</div>";

    const { render } = compile(template);
    const vNode = render.call(context);
    // console.log(render());
    // 运行时刻也不同，ast 编译时，vnode 运行时
    // vnode 简单
    // vnode 贯穿运行时
    expect(vNode).toEqual({
      tag: "div",
      props: null,
      children: "foo",
    });
  });
});

// 作业20230422
//
