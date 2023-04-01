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

function combineTag(nodes, retNodes = []) {
  // [
  //   { type: "tagStart", name: "div" },
  //   { type: "tagEnd", name: "div" },
  // ];
  let i = 0;
  let cacheNode = [];
  while (i < nodes.length) {
    const tagNode = nodes[i];
    const lastEleNode = cacheNode[cacheNode.length - 1];
    if (tagNode && tagNode.type === "tagStart") {
      const elementNode = {
        tag: "div",
        type: "Element",
        children: [],
        isUnary: false,
      };
      // 子状态机 - parseElement -> 内部循环，循环转递归
      cacheNode.push(elementNode);
      if (lastEleNode) {
        // 非顶层
        lastEleNode.children.push(elementNode);
      } else {
        // 顶层
        retNodes.push(elementNode);
      }
    } else if (tagNode && tagNode.type === "tagEnd") {
      if (tagNode.name === lastEleNode.tag || lastEleNode.isUnary) {
        cacheNode.pop();
      } else {
        throw new Error("unmatched tag");
      }
    }
    i++;
  }
  return retNodes;
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
    }
    if (!node) {
      // 文本节点
      parseText(context, stack);
    }
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
    child = parseChildren(context, stack);

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
    isUnary: false,
    children: [],
  };
  // ['<div>', 'div', index: 0, input: '<div>', groups: undefined]
  const consumeTag = pattern.exec(context.source);
  const consumeTagLen = consumeTag[0].length;
  node.tag = consumeTag[1];
  // context.source 操作，消费 <div>
  context.advance(consumeTagLen);

  parseAttribute();

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
function parseText(context, stack) {}

// 作业2 解析属性
function parseAttribute(context) {
  // 吃属性
  // 单双引号，属性判断
}

// 作业3 解析 {{}}
