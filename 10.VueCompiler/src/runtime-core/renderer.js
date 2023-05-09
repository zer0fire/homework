import { nodeOpts } from "../runtime-dom";

// 老的 vnode 会被存在哪儿？

export const Text = Symbol("Text");

// options 该平台下的操作
export function createRenderer(options = nodeOpts) {
  function unmount(container) {
    // 卸载
    container.innerHTML = "";
  }

  function mountElement(vnode, container) {
    const element = options.createElement(vnode.tag);
    if (typeof vnode.children === "string") {
      options.setText(element, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach((child) => {
        patch(child, element);
      });
    }
    if (vnode.props) {
      // 属性的添加和更新
      for (const key in vnode.props) {
        options.patchProp(element, key, null, vnode.props[key]);
      }
    }
    options.appendChild(container, element);
    vnode.el = element;
    return element;
  }

  function mountText(vnode, container) {
    const textNode = options.createTextNode(vnode.children);
    vnode.el = textNode;
    options.appendChild(container, textNode);
  }

  function patch(vnode, container) {
    // 顶层指定，递归 child和判定 text 用
    // 这里主要的好处是，省略了判定
    if (vnode.tag === Text) {
      mountText(vnode, container);
    } else {
      // 放置元素
      mountElement(vnode, container);
    }
  }

  function render(vnode, container) {
    // 老的 vnode 可以挂载 container 上
    container._vnode = vnode;
    if (!vnode) {
      unmount();
    } else {
      patch(vnode, container);
    }
  }
  return {
    render,
  };
}
