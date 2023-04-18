export function generate(node) {
  const context = {
    code: "",
    currentIndent: 0,
    newLine() {
      context.code += "\n" + `    `.repeat(context.currentIndent);
    },
    indent() {
      context.currentIndent++;
      context.newLine();
    },
    deIndent() {
      context.currentIndent--;
      context.newLine();
    },
    push(code) {
      context.code += code;
    },
  };
  genNode(node, context);
  return context.code;
}

function genNode(node, context) {
  switch (node.type) {
    case "FunctionDecl":
      genFunctionDecl(node, context);
      break;
    case "ReturnStatement":
      genReturnStatement(node, context);
      break;
    case "CallExpression":
      genCallExpression(node, context);
      break;
    case "StringLiteral":
      genStringLiteral(node, context);
      break;
    case "ArrayExpression":
      genArrayExpression(node, context);
      break;
    default:
      break;
  }
}

function genFunctionDecl(node, context) {
  const { push, indent, deIndent } = context;
  push(`function ${node.id.name}`);
  push(`(`);
  // 参数
  genNodeList(node.params, context);
  push(`) `);
  push(`{`);
  indent();
  // 函数体
  node.body.forEach((n) => genNode(n, context));
  deIndent();
  push(`}`);
}
function genReturnStatement(node, context) {
  const { push } = context;
  push(`return `);
  genNode(node.return, context);
}
function genCallExpression(node, context) {
  const { push } = context;
  const { callee, arguments: args } = node;
  push(`${callee.name}(`);
  genNodeList(args, context);
  push(`)`);
}
function genStringLiteral(node, context) {
  const { push } = context;
  push(`'${node.value}'`);
}
function genArrayExpression(node, context) {
  const { push } = context;
  push(`[`);
  genNodeList(node.elements, context);
  push(`]`);
}
function genNodeList(nodes, context) {
  const { push } = context;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    genNode(node, context);
    if (i < nodes.length - 1) {
      push(", ");
    }
  }
}
