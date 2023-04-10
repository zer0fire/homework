export function generate(ast) {
  // 参数三是单个文本节点，就用单个字符串表示
  // 参数三是单个的插值，就用单个 this.foo 表示
  // 参数三是混合的，文本用 this._v, 节点继续用 this._c

  // ret = `this._c('${node[0].tag}',null,'${children}');`;
  /**
    [
      {
        type: "Element",
        tag: "div",
        props: [],
        isUnary: false,
        children: [
          {
            type: "Interpolation",
            content: { type: "Expression", content: "foo" },
          },
        ],
      },
    ];
 */
  // return this._c('div',null,this.foo)
  const ret = generateNode(ast[0]);
  return `return ${ret}`;
}

function generateNode(node) {
  let children = null;

  switch (node.type) {
    case "Element":
      return generateElement(node);
    case "Interpolation":
      return generateInterpolation(node);
    case "Text":
      return generateText(node);
    default:
      break;
  }
  return "";
}
function generateElement(node) {
  let props = "null";
  if (node.props && node.props.length > 0) {
    const propsObj = {};
    for (const prop of node.props) {
      props[prop.name] = props.value;
    }
    props = JSON.stringify(propsObj);
  }
  let children = null;
  if (node.children.length <= 1) {
    if (node.children[0].type === "Interpolation") {
      // 插值
      children = `this.${node.children[0].content.content}`;
    } else if (node.children[0].type === "Text") {
      // 字符串
      children = `'${node.children[0].content}'`;
    }
  }
  if (!children) {
    const list = [];
    for (let child of node.children) {
      const str = `${generateNode(child)}`;
      list.push(str);
    }
    children = `[${list.toString()}]`;
  }

  return `this._c('${node.tag}',${props},${children})`;
}
function generateInterpolation(node) {
  return `this.${node.content.content}`;
}
function generateText(node) {
  return `this._v('${node.content}')`;
}
function generateChildren() {}
function generateProp() {}
