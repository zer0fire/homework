const State = {
  initial: 1,
  tagOpen: 2,
  tagName: 3,
  text: 4,
  tagEnd: 5,
  tagEndName: 6,
};

function isAlpha(char) {
  return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
}

function tokenize(str) {
  let currentState = State.initial;
  const chars = [];
  const tokens = [];

  while (str) {
    const char = str[0];
    switch (currentState) {
      case State.initial:
        if (char === "<") {
          // 转移状态
          currentState = State.tagOpen;
          // 消费字符，移动位置
          str = str.slice(1);
        } else if (isAlpha(char)) {
          currentState = State.text;
          chars.push(char);
          str = str.slice(1);
        } else if (char === " " || char === "\n") {
          str = str.slice(1);
        }
        break;
      case State.tagOpen:
        if (isAlpha(char)) {
          currentState = State.tagName;
          chars.push(char);
          str = str.slice(1);
        } else if (char === "/") {
          currentState = State.tagEnd;
          str = str.slice(1);
        } else if (char === " " || char === "\n") {
          throw new Error("illegal space");
        }
        break;
      case State.tagName:
        if (isAlpha(char)) {
          chars.push(char);
          str = str.slice(1);
        } else if (char === ">") {
          currentState = State.initial;
          tokens.push({
            type: "tag",
            name: chars.join(""),
          });
          chars.length = 0;
          str = str.slice(1);
        } else if (char === " " || char === "\n") {
          throw new Error("illegal space");
        }
        break;
      case State.text:
        if (isAlpha(char)) {
          chars.push(char);
          str = str.slice(1);
        } else if (char === "<") {
          currentState = State.tagOpen;
          tokens.push({
            type: "text",
            content: chars.join(""),
          });
          chars.length = 0;
          str = str.slice(1);
        } else if (char === " " || char === "\n") {
          str = str.slice(1);
        }
        break;
      case State.tagEnd:
        if (isAlpha(char)) {
          currentState = State.tagEndName;
          chars.push(char);
          str = str.slice(1);
        } else if (char === " " || char === "\n") {
          throw new Error("illegal space");
        }
        break;
      case State.tagEndName:
        if (isAlpha(char)) {
          chars.push(char);
          str = str.slice(1);
        } else if (char === ">") {
          currentState = State.initial;
          tokens.push({
            type: "tagEnd",
            name: chars.join(""),
          });
          chars.length = 0;
          str = str.slice(1);
        } else if (char === " " || char === "\n") {
          throw new Error("illegal space");
        }
        break;
    }
  }
  return tokens;
}

function dump(node, indent = 0) {
  const type = node.type;
  // console.log(node);
  const desc =
    node.type === "Root"
      ? ""
      : node.type === "Element"
      ? node.tag
      : node.content;
  console.log(`${"-".repeat(indent)}${type}: ${desc}`);
  if (node.children) {
    node.children.forEach((child) => dump(child, indent + 2));
  }
}

function traverseNode(ast, context) {
  context.currentNode = ast;
  // 退出阶段回调
  const exitFns = [];
  // 回调数组 transforms
  const transforms = context.nodeTransforms;

  for (let i = 0; i < transforms.length; i++) {
    // transform 里的函数可以返回用户自定义的 onExit 函数
    const onExit = transforms[i](context.currentNode, context);
    if (onExit) {
      // 添加退出阶段的回调
      exitFns.push(onExit);
    }
    if (!context.currentNode) {
      // 检测副作用下是否会导致节点被删除
      return;
    }
  }

  const children = context.currentNode.children;

  if (children) {
    for (let i = 0; i < children.length; i++) {
      context.parent = context.currentNode;
      context.childIndex = i;
      traverseNode(children[i], context);
    }
  }
  // 子节点遍历结束后调用。
  // 并且是反顺序执行的 tA -> tB -> eB -> eA
  let i = exitFns.length;
  while (i--) {
    exitFns[i];
  }
}

function parse(str) {
  const tokens = tokenize(str);
  const root = {
    type: "Root",
    children: [],
  };
  const elementStack = [root];

  while (tokens.length) {
    const parent = elementStack[elementStack.length - 1];
    const t = tokens[0];
    switch (t.type) {
      case "text":
        const textNode = {
          type: "Text",
          content: t.content,
        };
        parent.children.push(textNode);
        break;
      case "tag":
        const elementNode = {
          type: "Element",
          tag: t.name,
          children: [],
        };
        parent.children.push(elementNode);
        elementStack.push(elementNode);
        break;
      case "tagEnd":
        elementStack.pop();
        break;
    }
    tokens.shift();
  }
  return root;
}

function transformElement(node, context) {
  if (node.type === "Element" && node.tag === "p") {
    node.tag = "h1";
  }
}
function transformText(node, context) {
  if (node.type === "Text") {
    context.replaceNode({
      type: "Element",
      tag: "span",
    });
  }
}

function transform(ast) {
  const context = {
    currentNode: null,
    childIndex: 0,
    parent: null,
    replaceNode(node) {
      context.parent.children[context.childIndex] = node;
      context.currentNode = node;
    },
    removeNode() {
      if (context.parent) {
        context.parent.children.splice(context.childIndex, 1);
        context.currentNode = null;
      }
    },
    nodeTransforms: [
      transformElement, // 操作标签节点
      transformText, // 操作文本节点
    ],
  };
  traverseNode(ast, context);
  dump(ast);
}
const tokens = parse(`<div><p>Vue</p><p>Template</p></div>`);
transform(tokens);
// console.log(tokens);

function parseChildren(context, ancestors) {
  let nodes = [];
  const { mode, source } = context;

  while (!isEnd(context, ancestors)) {
    let node;
    if (mode === TextModes.DATA || mode === TextModes.RCDATA) {
      if (mode === TextModes.DATA && source[0] === "<") {
        if (source[1] === "!") {
          if (source.startsWith("<!--")) {
            node = parseComment(context);
          } else if (source.startsWith("<![CDATA[")) {
            node = parseCDATA(context, ancestors);
          }
        } else if (source[1] === "/") {
          // 结束标签
        } else if (/[a-z]/i.test(source[1])) {
          node = parseElement(context, ancestors);
        }
      } else if (source.startsWith("{{")) {
        node = parseInterpolation(context);
      }
    }
    if (!node) {
      node = parseText(context);
    }
    nodes.push(node);
  }
  return nodes;
}
