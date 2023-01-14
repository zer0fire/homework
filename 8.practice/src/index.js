const { walk, Scope } = require("../../3.walk/index.js");
const acorn = require("acorn");

// TODO:
// addDefines 函数
// defines 加入
// scope 替换 scope stack

const analyze = (code) => {
  const ast = acorn.parse(code, { ecmaVersion: 7 });
  const scopeStack = [];
  const rootScope = new Scope({ name: "root" });
  scopeStack.push(rootScope);

  const allScope = [];
  allScope.push(rootScope);

  const _defines = {};
  const definesStack = [_defines];

  const _scope = rootScope;
  const _calls = {};

  function addDefines() {}

  walk(ast, {
    enter: (node) => {
      if (node.type === "VariableDeclaration") {
        node.declarations.forEach((declare) => {
          definesStack[definesStack.length - 1][declare.id.name] = true;
          scopeStack[scopeStack.length - 1].add(declare.id.name);
        });
      } else if (
        node.type === "ArrowFunctionExpression" ||
        node.type === "IfStatement" ||
        node.type === "ForStatement"
      ) {
        // console.log(`${node.id.name} => `)
        // console.log(node)
        const parent = scopeStack[scopeStack.length - 1];
        const childScope = new Scope({
          name: node,
          parent,
        });
        // parent.children.push(funcScope)
        scopeStack.push(childScope);
        definesStack.push({});
        // allScope.push(childScope);
      } else if (node.type === "FunctionDeclaration") {
        const parent = scopeStack[scopeStack.length - 1];
        // console.log(node);
        parent.add(node.id.name);
        const childScope = new Scope({
          name: node,
          parent,
        });
        // parent.children.push(funcScope)
        scopeStack.push(childScope);
        definesStack.push({});
        // allScope.push(childScope);
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
        const currentScope = scopeStack.pop();
        const currentDefines = definesStack.pop();
        node._scope = currentScope;
        node._defines = currentDefines;
      }
    },
  });
  ast._scope = rootScope;
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
