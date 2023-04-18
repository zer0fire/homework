export function dump(node, indent = 0) {
  const type = node.type;
  const desc =
    node.type === "Root"
      ? ""
      : node.type === "Element"
      ? node.tag
      : node.content;
  //   console.log(`${"-".repeat(indent)} ${type} : ${desc}`);
  if (node.children) {
    node.children.forEach((n) => dump(n, indent + 2));
  }
}

export function transPtoH1(node) {
  if (node.type === "Element" && node.tag === "p") {
    node.tag = "h1";
  }
}

export function transText(node) {
  if (node.type === "Text") {
    node.content = node.content.repeat(2);
  }
}

export function createStringLiteral(value) {
  return {
    type: "StringLiteral",
    value,
  };
}
export function createIdentifier(name) {
  return {
    type: "Identifier",
    name,
  };
}
export function createArrayExpression(elements) {
  return {
    type: "ArrayExpression",
    elements,
  };
}
export function createCallExpression(callee, args) {
  return {
    type: "CallExpression",
    arguments: args,
    callee: createIdentifier("h"),
  };
}
