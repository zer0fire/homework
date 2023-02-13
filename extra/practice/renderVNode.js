const vnode = {
  tag: "DIV",
  attrs: {
    id: "app",
  },
  children: [
    {
      tag: "SPAN",
      children: [
        {
          tag: "A",
          children: [],
        },
      ],
    },
    {
      tag: "SPAN",
      children: [
        {
          tag: "A",
          children: [],
        },
        {
          tag: "A",
          children: [],
        },
      ],
    },
  ],
};
function render(vnode) {
  const node = createElement(vnode);
  const children = vnode.children;
  for (let childVNode of children) {
    const childNode = render(childVNode);
    appendChild(node, childNode);
  }
  console.log(node);
  return node;
}
function createElement(vnode) {
  const node = document.createElement(vnode.tag);
  const attrs = vnode.attrs;
  for (let attr in attrs) {
    node[attr] = attrs[attr];
  }
  return node;
}

function appendChild(parent, child) {
  return parent.appendChild(child);
}
