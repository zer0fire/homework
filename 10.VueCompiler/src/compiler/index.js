import { generate } from "./generate";
import { parse } from "./parse";

export * from "./parse";
export * from "./generate";

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

export function compile(template) {
  const ast = parse(template);
  const func = generate(ast);

  return {
    render: function () {
      return new Function(func).call(this);
    },
  };
}
