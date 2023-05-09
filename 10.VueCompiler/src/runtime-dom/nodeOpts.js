export const nodeOpts = {
  createElement: function (tag) {
    return document.createElement(tag);
  },
  setText(element, text) {
    element.textContent = text;
  },
  appendChild: function (parent, child) {
    return parent.appendChild(child);
  },
  createTextNode: function (text) {
    return document.createTextNode(text);
  },
  patchProp(element, key, oldValue, newValue) {
    if (key.startsWith("on")) {
      const callback = newValue;
      const event = key.slice(2).toLowerCase();
      // element.removeEventListener 解绑老事件
      // 如果事件没变怎么办
      element.addEventListener(event, () => {
        callback();
      });
    } else {
      element.setAttribute(key, newValue);
      // if (!oldValue) {
      //   // 新增
      // } else {
      //   // 修改
      // }
    }
  },
};
