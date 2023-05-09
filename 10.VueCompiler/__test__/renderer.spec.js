import { createRenderer, Text } from "../src/runtime-core";
describe("renderer", () => {
  it("renderer.render", () => {
    const renderer = createRenderer();
    const container = document.createElement("div");
    const vnode = {
      tag: "div",
      children: "hello",
    };
    renderer.render(vnode, container);
    expect(container.innerHTML).toBe("<div>hello</div>");
  });
  it("render text", () => {
    const renderer = createRenderer();
    const container = document.createElement("div");
    const vnode = {
      // tag 是对象，说明 vnode 是组件；tag 是字符串，说明是原生节点；tag 是 Symbol 说明是 Text 或其他的
      tag: Text, // Text是一个Symbol
      children: "hello",
    };
    renderer.render(vnode, container);
    expect(container.innerHTML).toBe("hello");
  });
  it("render text and element", () => {
    const renderer = createRenderer();
    const container = document.createElement("div");
    const vnode = {
      tag: "div",
      children: [
        { tag: Text, children: "hello" },
        { tag: "span", children: "vue" },
      ],
    };
    renderer.render(vnode, container);
    expect(container.innerHTML).toBe("<div>hello<span>vue</span></div>");
  });
  it("set element attributes", () => {
    const renderer = createRenderer();
    const container = document.createElement("div");
    const onClick = jest.fn();
    const vnode = {
      tag: "div",
      props: { id: "box", class: "box", onClick },
      children: "hello",
    };
    renderer.render(vnode, container);
    expect(container.innerHTML).toMatch(
      '<div id="box" class="box">hello</div>'
    );
    const div = container.firstElementChild;
    div.dispatchEvent(new Event("click"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
