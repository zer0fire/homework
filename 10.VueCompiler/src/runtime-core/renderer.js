import { compile } from "../compiler";
import { parse } from "../compiler/parse";
import { nodeOpts } from "../runtime-dom";

// 老的 vnode 会被存在哪儿？

export const Text = Symbol("Text");

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

// options 该平台下的操作
export function createRenderer(options = nodeOpts) {
  function unmount(vnode) {
    // 缺陷：事件解绑没做、v-xxx 指令没有 unmount、组件的 unmount 没被触发、不跨平台
    // 参数一：vnode ，作用：卸载
    // container.innerHTML = "";
    // ?: 大纲：
    // 找到事件、指令、组件
    // 需要找到 vnode 对应的元素
    const element = vnode.el;
    // 找到元素对应父节点
    const parent = vnode.el.parentNode; // ?
    // deleteContent -> removeChild
    parent.removeChild(element);
    vnode.el = null;
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

  // Vue 组件 -> 组件对象 -> 组件实例 -> 得到虚拟 node -> patch 得到真实 DOM
  // 处理所有组件选项，并且执行组件渲染函数，建立响应式更新机制保证更新
  // 组件实例 / 组件上下文
  function mountComponent(options, container) {
    if (!options.render) {
      const { render } = compile(options.tag.template);
      const data = (options.tag.data && options.tag.data()) || {};
      const target = Object.assign(context, data);
      options.render = render.bind(target);
    }
    const subTree = options.render();
    patch(subTree, container);
  }

  function patch(vnode, container) {
    // 更新的第一部分，删除
    if (vnode.tag === Text) {
      mountText(vnode, container);
    } else if (typeof vnode.tag === "string") {
      const oldVNode = container._vnode;
      if (oldVNode && oldVNode.tag !== vnode.tag) {
        unmount(oldVNode);
        mountElement(vnode, container);
      } else if (oldVNode && oldVNode.tag === vnode.tag) {
        mountElement(vnode, container);
      } else if (!oldVNode) {
        mountElement(vnode, container);
      }
    } else if (typeof vnode.tag === "object") {
      mountComponent(vnode, container);
    }
  }

  function render(vnode, container) {
    // 老的 vnode 可以挂载 container 上
    if (!vnode) {
      unmount(container._vnode);
    } else {
      // console.log(vnode, container._vnode);
      patch(vnode, container);
    }
    container._vnode = vnode;
  }

  function createApp(rootOption) {
    const vnode = {
      tag: rootOption,
    };
    function mount(container) {
      return render(vnode, container);
    }
    const app = {
      mount,
    };
    return app;
  }

  return {
    render,
    createApp,
  };
}
