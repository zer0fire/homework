import { createRenderer, Text } from "../src/runtime-core";
import { createApp } from "../src/runtime-dom";
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
  it("render component", () => {
    const renderer = createRenderer();
    const container = document.createElement("div");
    const vnode = {
      tag: {
        template: "<div>component</div>",
      },
    };
    renderer.render(vnode, container);
    expect(container.innerHTML).toBe("<div>component</div>");
  });
  it("render component with dynamic data", () => {
    const renderer = createRenderer();
    const container = document.createElement("div");
    const vnode = {
      tag: {
        template: "<div>{{title}}</div>",
        data() {
          return { title: "this is a component" };
        },
      },
    };
    renderer.render(vnode, container);
    expect(container.innerHTML).toBe("<div>this is a component</div>");
  });
  it("createApp of renderer", () => {
    const renderer = createRenderer();
    const container = document.createElement("div");
    renderer
      .createApp({
        template: "<div>{{title}}</div>",
        data() {
          return {
            title: "hello, mini-vue!",
          };
        },
      })
      .mount(container);
    expect(container.innerHTML).toBe("<div>hello, mini-vue!</div>");
  });
  test("createApp in runtime-dom", () => {
    const container = document.createElement("div");
    container.id = "app";
    // container.innerHTML = "<div>{{title}}</div>";
    document.body.appendChild(container);
    createApp({
      template: "<div>{{title}}</div>",
      data() {
        return {
          title: "hello, mini-vue!",
        };
      },
    }).mount("#app");
    expect(container.innerHTML).toBe("<div>hello, mini-vue!</div>");
  });
  test("unmount", () => {
    const renderer = createRenderer();
    const container = document.createElement("div");
    const vnode = {
      tag: "div",
      children: "hello",
    };
    renderer.render(vnode, container);
    expect(container.innerHTML).toBe("<div>hello</div>");
    renderer.render(null, container);
    expect(container.innerHTML).toBe("");
  });
  test("node's type change", () => {
    const renderer = createRenderer();
    const container = document.createElement("div");
    const oldVnode = {
      tag: "div",
      children: "hello",
    };
    const newVnode = {
      tag: "p",
      children: "hello",
    };
    // 作业：把替换操作实现
    renderer.render(oldVnode, container);
    expect(container.innerHTML).toBe("<div>hello</div>");
    renderer.render(newVnode, container);
    expect(container.innerHTML).toBe("<p>hello</p>");
  });
  test("update text", () => {
    const renderer = createRenderer();
    const container = document.createElement("div");
    const oldVnode = {
      tag: Text,
      children: "hello",
    };
    const newVnode = {
      tag: Text,
      children: "olleh",
    };
    renderer.render(oldVnode, container);
    expect(container.innerHTML).toBe("hello");
    renderer.render(newVnode, container);
    expect(container.innerHTML).toBe("olleh");
  });
  test("update props", () => {
    const renderer = createRenderer();
    const container = document.createElement("div");
    const oldVnode = {
      tag: "div",
      props: { id: "box", class: "box", title: "box" },
    };
    const newVnode = {
      tag: "div",
      props: { id: "box", class: "box active" },
    };
    renderer.render(oldVnode, container);
    expect(container.innerHTML).toBe(
      '<div id="box" class="box" title="box"></div>'
    );
    renderer.render(newVnode, container);
    expect(container.innerHTML).toBe('<div id="box" class="box active"></div>');
  });
  test("update element", () => {
    const renderer = createRenderer();
    const container = document.createElement("div");
    const oldVnode = {
      tag: "div",
      children: "hello",
    };
    const newVnode = {
      tag: "div",
      children: "olleh",
    };
    renderer.render(oldVnode, container);
    expect(container.innerHTML).toBe("<div>hello</div>");
    renderer.render(newVnode, container);
    expect(container.innerHTML).toBe("<div>olleh</div>");
  });
  test("update element array chidren to text", () => {
    const renderer = createRenderer();
    const container = document.createElement("div");
    const oldVnode = {
      tag: "div",
      children: [
        {
          tag: "span",
          children: "child",
        },
      ],
    };
    const newVnode = {
      tag: "div",
      children: "child",
    };
    renderer.render(oldVnode, container);
    expect(container.innerHTML).toBe("<div><span>child</span></div>");
    renderer.render(newVnode, container);
    expect(container.innerHTML).toBe("<div>child</div>");
  });
  test("update element text chidren to array", () => {
    const renderer = createRenderer();
    const container = document.createElement("div");
    const oldVnode = {
      tag: "div",
      children: "child",
    };
    const newVnode = {
      tag: "div",
      children: [
        {
          tag: "span",
          children: "child",
        },
      ],
    };
    renderer.render(oldVnode, container);
    expect(container.innerHTML).toBe("<div>child</div>");
    renderer.render(newVnode, container);
    expect(container.innerHTML).toBe("<div><span>child</span></div>");
  });
  test("diff：node move", () => {
    const renderer = createRenderer();
    const container = document.createElement("div");
    const oldVnode = {
      tag: "div",
      children: [
        {
          tag: "p",
          children: "p1",
          key: "1",
        },
        {
          tag: "p",
          children: "p2",
          key: "2",
        },
        {
          tag: "p",
          children: "p3",
          key: "3",
        },
      ],
    };
    const newVnode = {
      tag: "div",
      children: [
        {
          tag: "p",
          children: "p3",
          key: "3",
        },
        {
          tag: "p",
          children: "p1",
          key: "1",
        },
        {
          tag: "p",
          children: "p2",
          key: "2",
        },
      ],
    };
    renderer.render(oldVnode, container);
    expect(container.innerHTML).toBe("<div><p>p1</p><p>p2</p><p>p3</p></div>");
    renderer.render(newVnode, container);
    expect(container.innerHTML).toBe("<div><p>p3</p><p>p1</p><p>p2</p></div>");
  });
});

// 疑问：innerHTML 里的内容如何处理，innerHTML + template + render 函数，谁最终生效，优先级最高？
// render 最高
// 没有 render ，看看 template
// innerHTML
