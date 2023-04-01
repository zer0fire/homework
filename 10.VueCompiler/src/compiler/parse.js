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
  return isLowercase(char) || isUppercase(char);
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
 * @param {*} context
 * @param {*} stack 判定节点内是否清空
 */
function parseChildren(context, stack) {
  // 存储 ast 结果
  const { source } = context;

  const nodes = [];
  let tagObj = null;

  function start(char) {
    if (char === "<") {
      return tagOpen;
    } else {
      return start;
    }
  }

  function tagOpen(char) {
    if (char === "/") {
      return tagEnd;
    } else if (isAlphabet(char)) {
      return tagStart(char);
    } else {
      return start;
    }
  }

  function tagStart(char) {
    if (isAlphabet(char)) {
      if (!tagObj) {
        tagObj = {
          type: "tagStart",
          name: "",
        };
      }
      tagObj.name += char;
      return tagStart;
    } else if (char === ">") {
      nodes.push(tagObj);
      tagObj = null;
      return start;
    } else {
      return start;
    }
  }

  function tagEnd(char) {
    if (isAlphabet(char)) {
      if (!tagObj) {
        tagObj = {
          type: "tagEnd",
          name: "",
        };
      }
      tagObj.name += char;
      return tagStart;
    } else if (char === ">") {
      nodes.push(tagObj);
      tagObj = null;
      return start;
    } else {
      return start;
    }
  }

  let machine = start;
  let i = 0;
  // 开启状态机，
  while (source && i < source.length) {
    // isEnd 结束条件 错误停止或者解析到最后停止
    // < 开始
    // a-z 标签
    // {{ 插值
    // > 结束
    // parseElement 专门解决 a-z
    // parseInterpolation 专门解决插值
    // parseTextNode 遇到文本节点
    machine = machine(source[i], context);
    i++;
  }
  // [{ tagStart, div}, {tagEnd, div}]
  // 返回 nodes
  // console.log({
  //   nodes,
  //   ele: combineTag(nodes),
  // });
  return combineTag(nodes);
}
