function shouldSetAsProps(el, key, value) {
  if (key === "form" && element.tagName === "INPUT") return false;
  return key in el;
}
export const nodeOpts = {
  createElement: function (tag) {
    return document.createElement(tag);
  },
  setText(element, text) {
    return (element.textContent = text);
  },
  appendChild: function (parent, child) {
    return parent.appendChild(child);
  },
  createTextNode: function (text) {
    return document.createTextNode(text);
  },
  insertBefore: function (insertChild, parent, anchor = null) {
    parent.insertBefore(insertChild, anchor);
  },
  patchProp(element, key, oldValue, newValue) {
    if (key.startsWith("on")) {
      // 事件
      const callback = newValue;
      const event = key.slice(2).toLowerCase();
      const invokers =
        element._vnodeEventInvoker || (element._vnodeEventInvoker = {});
      // 'click'
      let invoker = invokers[event];
      if (newValue) {
        if (!invoker) {
          invoker = element._vnodeEventInvoker[event] = (e) => {
            // 懒操作
            // try catch 错误处理
            invoker.value(e);
          };
          invoker.value = callback;
          element.addEventListener(event, invoker);
        } else {
          invoker.value = callback;
        }
      } else if (!newValue && invoker) {
        element.removeEventListener(event, invoker);
      }
      // element.removeEventListener 解绑老事件
      // 如果事件没变怎么办
      element._vnodeEventInvoker[event] = invoker;
    } else {
      if (newValue !== null) {
        element.setAttribute(key, newValue);
      } else {
        element.removeAttribute(key);
      }
    }
  },
};
