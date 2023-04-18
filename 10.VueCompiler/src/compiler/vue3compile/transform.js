import {
  createArrayExpression,
  createCallExpression,
  createIdentifier,
  createStringLiteral,
} from "./utils";

export function transform(ast) {
  const context = {
    nodeTransforms: [transformElement, transformText, transformRoot],
    currentNode: null,
    childIndex: 0,
    parent: null,
  };
  traverseNode(ast, context);
  //   console.log(dump(ast));
}

function traverseNode(ast, context) {
  context.currentNode = ast;
  const fnExitList = [];
  const transforms = context.nodeTransforms;
  for (let i = 0; i < transforms.length; i++) {
    const onExit = transforms[i](context.currentNode, context);
    if (onExit) {
      fnExitList.push(onExit);
    }
    if (!context.currentNode) {
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
  let len = fnExitList.length;
  while (len--) {
    // console.log(fnExitList[len]);

    fnExitList[len]();
  }
}

function transformText(node) {
  if (node.type !== "Text") {
    return;
  }
  node.jsNode = createStringLiteral(node.content);
}

function transformElement(node) {
  return function transformElementCallback() {
    if (node.type !== "Element") {
      return;
    }
    const callExp = createCallExpression("h", [createStringLiteral(node.tag)]);
    node.children.length === 1
      ? callExp.arguments.push(node.children[0].jsNode)
      : callExp.arguments.push(
          createArrayExpression(node.children.map((c) => c.jsNode))
        );
    node.jsNode = callExp;
  };
}

function transformRoot(node) {
  return function transformRootCallback() {
    if (node.type !== "Root") {
      return;
    }
    const vNodeJsAST = node.children[0].jsNode;

    node.jsNode = {
      type: "FunctionDecl",
      id: createIdentifier("render"),
      params: [],
      body: [
        {
          type: "ReturnStatement",
          return: vNodeJsAST,
        },
      ],
    };
  };
}
