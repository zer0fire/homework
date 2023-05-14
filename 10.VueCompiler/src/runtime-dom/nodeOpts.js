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
  patchProp(element, key, oldValue, newValue) {
    if (key.startsWith("on")) {
      // 事件
      const callback = newValue;
      const event = key.slice(2).toLowerCase();
      const invokers =
        element._vnodeEventInvoker || (element._vnodeEventInvoker = {});
      let invoker = invokers[event];
      if (newValue) {
        if (invoker) {
          invoker.value = callback;
        } else {
          invoker = element._vnodeEventInvoker[event] = (e) => {
            invoker.value(e);
          };
          invoker.value = callback;
          element.addEventListener(event, invoker);
        }
      } else if (!newValue && invoker) {
        element.removeEventListener(event, invoker);
      }
      // element.removeEventListener 解绑老事件
      // 如果事件没变怎么办
      element._vnodeEventInvoker[event] = invoker;
    } else {
      element.setAttribute(key, newValue);
    }
  },
};
