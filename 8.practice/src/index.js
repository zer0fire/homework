const { walk, Scope } = require("../../3.walk/index.js");
const acorn = require("acorn");

// TODO:
// addDefines 函数
// defines 加入
// scope 替换 scope stack

const analyze = (code) => {
  const ast = acorn.parse(code, { ecmaVersion: 7 });
  let currentScope = new Scope({ name: "root" });

  const allScope = [];
  allScope.push(currentScope);

  const _defines = {};
  const definesStack = [_defines];

  const _calls = {};

  function addDefines() {}

  walk(ast, {
    enter: (node) => {
      if (node.type === "VariableDeclaration") {
        node._defines = {};
        node.declarations.forEach((declare) => {
          //   const defines = definesStack[definesStack.length - 1];
          //   defines[declare.id.name] = true;
          node._defines[declare.id.name] = true;
          _defines[declare.id.name] = true;
          currentScope.add(declare.id.name);
        });
      } else if (
        node.type === "ArrowFunctionExpression" ||
        node.type === "IfStatement" ||
        node.type === "ForStatement"
      ) {
        const parent = currentScope;
        const childScope = new Scope({
          name: node,
          parent,
        });
        // parent.children.push(funcScope)
        currentScope = childScope;
        // allScope.push(childScope);
        definesStack.push({});
      } else if (node.type === "FunctionDeclaration") {
        const parent = currentScope;
        parent.add(node.id.name);
        const childScope = new Scope({
          name: node,
          parent,
        });
        // parent.children.push(funcScope)
        currentScope = childScope;
        // allScope.push(childScope);
        definesStack.push({});
      }
      if (node.type === "ExpressionStatement") {
        _calls[node.expression.callee.name] = true;
      }
    },
    leave: (node) => {
      if (
        node.type === "FunctionDeclaration" ||
        node.type === "ArrowFunctionExpression" ||
        node.type === "IfStatement" ||
        node.type === "ForStatement"
      ) {
        // const currentScope = childScope.parent;
        node._scope = currentScope;
        currentScope = currentScope.parent;
        const currentDefines = definesStack.pop();
        node._defines = currentDefines;
      }
      if (node.type === "FunctionDeclaration") {
        node._defines[node.id.name] = true;
        _defines[node.id.name] = true;
      }
    },
  });
  ast._scope = currentScope;
  //   return {
  //     _defines,
  //     _scope,
  //     _calls,
  //   };
  ast._defines = _defines;
  ast._calls = _calls;
  return ast;
};

module.exports = {
  analyze,
};
