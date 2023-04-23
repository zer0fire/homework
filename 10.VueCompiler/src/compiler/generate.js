export function generate(ast) {
  // TODO:
  // 参数三是单个文本节点，就用单个字符串表示
  // 参数三是单个的插值，就用单个 this.foo 表示
  // 参数三是混合的，文本用 this._v, 节点继续用 this._c
  // 参数三是元素的，最后也要用 [] 包起来
  const ret = generateNode(ast[0]);
  return `return ${ret}`;
}

function generateNode(node) {
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
  if (node.children.length > 0) {
    return `this._c('${node.tag}',${generateProps(
      node.props
    )},${generateChildren(node.children)})`;
  } else {
    return `this._c('${node.tag}',${generateProps(node.props)})`;
  }
}

function generateInterpolation(node) {
  return `this.${node.content.content}`;
}

function generateText(node, isWrap = true) {
  return isWrap ? `this._v('${node.content}')` : `'${node.content}'`;
}

function generateChildren(children) {
  let childStr = "null";
  if (!children || children.length <= 0) {
    return childStr;
  }
  if (children.length === 1) {
    if (children[0].type === "Interpolation") {
      // 插值
      return generateInterpolation(children[0]);
    } else if (children[0].type === "Text") {
      // 字符串
      return generateText(children[0], false);
    } else {
      return `[${generateElement(children[0])}]`;
    }
  } else {
    const list = [];
    for (let child of children) {
      const str = `${generateNode(child)}`;
      list.push(str);
    }
    return `[${list.join(",")}]`;
  }
}

function generateProps(props) {
  let propsStr = "";
  if (props && props.length > 0) {
    propsStr = `{${props
      .map((prop) => `'${prop.name}':'${prop.value}'`)
      .join(",")}}`;
  }
  if (!propsStr) {
    propsStr = "null";
  }
  return propsStr;
}
