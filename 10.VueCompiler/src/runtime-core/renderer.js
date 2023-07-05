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

  function mountElement(vnode, container, anchor) {
    const element = options.createElement(vnode.tag);
    if (typeof vnode.children === "string") {
      options.setText(element, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach((child) => {
        patch(null, child, element);
      });
    }
    if (vnode.props) {
      // 属性的添加和更新
      for (const key in vnode.props) {
        options.patchProp(element, key, null, vnode.props[key]);
      }
    }
    options.insertBefore(element, container, anchor);
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
    patch(null, subTree, container);
  }

  function updateText(oldVNode, vnode) {
    if (oldVNode.children !== vnode.children) {
      options.setText(oldVNode.el, vnode.children);
    }
  }

  function patchChildren(oldChildren, newChildren, parent) {
    // 简单 diff key

    // 双循环
    // for (let index = 0; index < oldChildren.length; index++) {
    //   const oldChild = oldChildren[index];
    //   const newChild = newChildren[index];
    //   if (!newChild || newChild.type !== oldChild.type) {
    //     // 新没有，老有，删除
    //     unmount(oldChild);
    //   }
    // }
    // for (let index = 0; index < newChildren.length; index++) {
    //   const newChild = newChildren[index];
    //   const oldChild = oldChildren[index];
    //   if (oldChild && oldChild.type === newChild.type) {
    //     // 两边都有，更新
    //     patch(oldChild, newChild, parent);
    //   } else if (!oldChild) {
    //     // 新有，老没有，新增
    //     patch(null, newChild, parent);
    //   }
    // }

    // 暴力更新
    // 找到短的更新
    // 节点没法复用

    // 先进的 diff
    // 双端 diff ，假定数组两端会找到很多相同的节点，头头，头尾，尾头，尾尾比较
    // Vue3 的新 diff，双端 diff 之后，最长递增子序列。双端 diff 后新老数组都剩下了，说明情况混乱，希望可以经过最少的移动得到新内容

    // 新的里面取一个，找到老的里面的相同的位置，这个叫参照索引
    // 如果后续的节点的老索引，比参照索引小，说明需要移动的新索引
    // 如果后续的节点的老索引，比参照索引大，说明参照索引需要改变成当前的老索引
    // 在什么时候创建新的内容
    let referIndex = -1;
    for (let i = 0; i < newChildren.length; i++) {
      let newChild = newChildren[i];
      let j = 0;
      for (; j < oldChildren.length; j++) {
        if (newChild && sameNode(newChild, oldChildren[j])) {
          if (j >= referIndex) {
            referIndex = j;
          } else {
            const anchor =
              oldChildren[referIndex + 1] && oldChildren[referIndex + 1].el;
            options.insertBefore(oldChildren[j].el, parent, anchor);
          }
          break;
        }
      }
      if (j >= oldChildren.length) {
        // TODO: 优化在 new 里获取 old 的 el，或者在 old 里面找到 create 插入位置的内容
        const prevIndex = oldChildren.findIndex(
          (it) => newChildren[i - 1] && sameNode(newChildren[i - 1], it)
        );
        const prevVNode = oldChildren[prevIndex];
        let anchor = null;
        if (prevVNode) {
          anchor = prevVNode.el.nextSibling;
        } else {
          anchor = parent.firstChild;
        }
        patch(null, newChildren[i], parent, anchor);
      }
    }
    // TODO: 删除优化
    for (let i = 0; i < oldChildren.length; i++) {
      const oldChild = oldChildren[i];
      if (
        newChildren.findIndex((newChild) => {
          return sameNode(newChild, oldChild);
        }) === -1
      ) {
        // remove
        unmount(oldChild);
      }
    }
  }

  function sameNode(a, b) {
    return a.key === b.key && a.tag === b.tag;
  }

  function patchElement(oldVNode, vnode) {
    const el = oldVNode.el;
    vnode.el = el;
    // children
    // 对比 children，递归 children
    const oldChildren = oldVNode.children;
    const newChildren = vnode.children;
    if (typeof oldChildren === "string" && typeof newChildren === "string") {
      // 文本和文本
      options.setText(el, newChildren);
    } else if (Array.isArray(oldChildren) && typeof newChildren === "string") {
      oldChildren.forEach((child) => {
        unmount(child);
      });
      // 数组和文本
      options.setText(el, newChildren);
    } else if (typeof oldChildren === "string" && Array.isArray(newChildren)) {
      // 文本和数组
      // 删除旧文本
      options.setText(el, "");
      // 挂载新子节点
      newChildren.forEach((child) => {
        patch(null, child, el);
      });
    } else if (Array.isArray(oldChildren) && Array.isArray(newChildren)) {
      // 数组和数组
      patchChildren(oldChildren, newChildren, el);
    }

    // attributes
    const oldProps = oldVNode.props;
    const newProps = vnode.props;

    for (const prop in oldProps) {
      if (!(prop in newProps)) {
        // 删除
        options.patchProp(el, prop, oldProps[prop], null);
      }
    }

    for (const prop in newProps) {
      const v1 = oldProps[prop];
      const v2 = newProps[prop];
      if (v1 !== v2) {
        // 更新
        options.patchProp(el, prop, v1, v2);
      }
    }
  }

  function patch(oldVNode, vnode, container, anchor = null) {
    // 先判断类型不同的情况，再处理
    if (oldVNode) {
      // 改 tag type
      if (oldVNode.tag !== vnode.tag) {
        unmount(oldVNode);
        oldVNode = null;
        container._vnode = null;
      }
    }

    // 更新的第一部分，删除
    if (vnode.tag === Text) {
      if (oldVNode) {
        updateText(oldVNode, vnode);
      } else {
        mountText(vnode, container);
      }
    } else if (typeof vnode.tag === "string") {
      if (oldVNode) {
        patchElement(oldVNode, vnode);
      } else {
        mountElement(vnode, container, anchor);
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
      patch(container._vnode, vnode, container);
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
