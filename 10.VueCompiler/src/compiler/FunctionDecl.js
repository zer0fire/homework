const FunctionDeclNode = {
  type: "FunctionDecl",
  id: {
    type: "Identifier",
    name: "render",
  },
  params: [],
  body: [
    {
      type: "ReturnStatement",
      return: null,
    },
  ],
};

function transformText(node) {
  if (node.type !== "Text") {
    return;
  }
  node.jsNode = createStringLiteral(node.content);
}

function transformElement(node) {
  return () => {};
}

function transformRoot(node) {}

function generate(node) {
  const context = {
    code: "",
    push(code) {
      context.code += code;
    },
    currentIndent: 0,
    newline() {
      context.code += "\n" + ` `.repeat(context.currentIndent);
    },
    indent() {
      context.currentIndent++;
      context.newline();
    },
    deIndent() {
      context.currentIndent--;
    },
  };
}
