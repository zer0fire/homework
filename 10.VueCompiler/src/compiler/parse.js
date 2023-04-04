/**
 * template -> ast -> render function (js function)
 * 1. 解析 template -> ast 中间产物，生产 ast 对象，可以做很多事情
 * 2. 转换 transform: ast -> ast 深加工，一种转换成另外一种 html ast -> js ast
 * 3. 生成 ast -> render function
 * isUnary ，自闭合
 */

/**
 *
 * @param {string} char
 * @returns
 */
function isLowercase(char) {
  const charCode = char.charCodeAt(0);
  return charCode >= "a".charCodeAt(0) && charCode <= "z".charCodeAt(0);
}

/**
 *
 * @param {string} char
 * @returns
 */
function isUppercase(char) {
  const charCode = char.charCodeAt(0);
  return charCode >= "A".charCodeAt(0) && charCode <= "Z".charCodeAt(0);
}

/**
 *
 * @param {string} char
 * @returns
 */
function isAlphabet(char) {
  return char.match(/[a-zA-Z]/i);
  // return isLowercase(char) || isUppercase(char);
  // return char !== "<" && char !== ">";
}

/**
 * @flow
 * @param {*} template
 */
export function parse(template) {
  // 状态机

  // 上下文，携带参数，或者获取 this 等，保存当前状态，提供一些工具函数
  const context = {
    source: template,
    // 消费，移动
    advance(num) {
      this.source = this.source.slice(num);
    },
    advanceSpace() {
      // 吃空格
      this.source = this.source.trim();
    },
  };

  //   return [
  //     {
  //       tag: "div",
  //       type: "Element",
  //       children: [],
  //       isUnary: false,
  //     },
  //   ];
  return parseChildren(context, []);
}

/**
 *
 * @param {{ source: string }} context
 * @param {*} stack 判定节点内是否清空
 */
function parseChildren(context, stack) {
  // 存储 ast 结果
  const nodes = [];

  // 结束条件
  while (!isEnd(context, stack)) {
    let node = null;
    // '<div></div>'
    // context.source 可改变，可迁移
    // <div>{{}}</div>
    if (context.source[0] === "<") {
      // 小于号
      // 状态 2 到 状态 3
      if (isAlphabet(context.source[1])) {
        // 处理当前的节点树 递归
        node = parseElement(context, stack);
      }
    } else if (context.source.startsWith("{{")) {
      // 插值
      parseInterpolation(context, stack);
    } else if (!node) {
      // 文本节点
      parseText(context, stack);
    }
    // console.log(node);
    nodes.push(node);
  }
  return nodes;
}
function isEnd(context, stack) {
  if (!context.source) {
    // source 没了，结束
    return true;
  }
  // 判断闭合标签。配对情况，有结束标签就配对，
  // stack 的最后一个元素和当前标签可以配对
  // { tag: 'div', type: 'tagStart' }
  const node = stack[stack.length - 1];
  // </div>
  if (node) {
    // 配对结束了，结束
    return context.source.startsWith(`</${node.tag}>`);
  }
}

function parseElement(context, stack) {
  // context.source 一部分转换成 { tag: 'div' }
  // 开始、 <div>
  const node = parseTag(context);
  // props
  if (!node.isUnary) {
    // children、
    stack.push(node);
    // TODO:
    // 处理 children
    const child = parseChildren(context, stack);

    // 结束
    parseTag(context, "end");
    stack.pop();
  }
  return node;
}
// /^<([a-z][^\t\r\n\f />]*)/i
// /^<\/([a-z][^\t\r\n\f />]*)/i
function parseTag(context, type = "start") {
  const startTagReg = /^<([a-z][^\t\r\n\f />]*)/i;
  const endTagReg = /^<\/([a-z][^\t\r\n\f />]*)/i;
  const pattern = type === "start" ? startTagReg : endTagReg;
  const node = {
    tag: "",
    type: "Element",
    props: [],
    isUnary: false,
    children: [],
  };
  // ['<div>', 'div', index: 0, input: '<div>', groups: undefined]
  const consumeTag = pattern.exec(context.source);
  const consumeTagLen = consumeTag[0].length;
  node.tag = consumeTag[1];
  // context.source 操作，消费 <div>
  context.advance(consumeTagLen);

  parseAttribute(context, node);

  if (context.source.startsWith("/>")) {
    node.isUnary = true;
    context.advance(2);
  } else {
    node.isUnary = false;
    context.advance(1);
  }
  return node;
}

// 作业1 文本
function parseText(context, stack) {
  // 插值和 < 是终点
  const endTokens = ["<", "{{"];
  let endIndex = context.source.length;
  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i], 1);
    if (index !== -1 && endIndex > index) {
      endIndex = index;
    }
  }
  const content = context.source.slice(0, endIndex);
  const lastNode = stack[stack.length - 1];
  const textNode = {
    type: "Text",
    content,
  };
  lastNode.children.push(textNode);

  context.advance(content.length);
  return textNode;
}

// 作业2 解析属性
function parseAttribute(context, node) {
  // 吃属性
  // id="foo" v-show="isShow"><div/>
  while (!context.source.startsWith("/>") && !context.source.startsWith(">")) {
    context.advanceSpace();
    // TODO: 单双引号，属性判断
    const [origin, name, value] = /^([^=]*)="([^=]*?)"/i.exec(context.source);
    const attribute = {
      type: "Attribute",
      name,
      value,
    };
    if (node.props) {
      node.props.push(attribute);
    } else {
      node.props = [attribute];
    }
    context.advance(origin.length);
  }
  return context;
}

// 作业3 解析 {{}}
function parseInterpolation(context, stack) {
  // 吃插值
  // {{foo}}{{bar}}<div/>
  const interpolationArray = [];
  while (!context.source.startsWith("<")) {
    context.advanceSpace();
    // TODO: 单双引号，属性判断
    const [interpolation, content] = /^{{([^<]*?)}}/i.exec(context.source);
    const lastNode = stack[stack.length - 1];
    const interpolationNode = {
      type: "Interpolation",
      content: {
        type: "Expression",
        content,
      },
    };
    lastNode.children.push(interpolationNode);
    interpolationArray.push(interpolationNode);
    context.advance(interpolation.length);
  }
  return interpolationArray;
}
