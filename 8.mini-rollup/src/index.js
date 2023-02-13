const { walk, Scope, analysis, MagicString } = require("../../3.walk/index.js");
const acorn = require("acorn");

// TODO:
// addDefines 函数
// defines 加入
// scope 替换 scope stack

const analyze = (ast, magicString) => {
  console.log(magicString);
  //   const ast = acorn.parse(code, { ecmaVersion: 7 });
  let currentScope = new Scope({ name: "root" });

  const allScope = [];
  allScope.push(currentScope);

  const _defines = {};
  const definesStack = [_defines];

  const _calls = {};

  //   function addDefines() {}

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

  ast.body.forEach((statement) => {
    walk(statement, {
      enter: (node) => {
        if (node.type === "Identifier") {
          statement._dependsOn[node.name] = true;
        }
      },
    });
  });

  return ast;
};

module.exports = {
  analyze,
};

// JS 的模块化从哪儿来，原理是什么

// 变量名污染问题、非私有篡改问题、

// 为什么不是代码可读性？代码规范没必要做这个事，工具做就好
// 微机：单片机 -> 服务器 -> 工作站 1-4 路 -> 小型机 10 cpu -> 中型机 -> 100 cpu -> 大型机 1000 cpu
// IBM OS390 Cobol 语言
// C++ 编程思想

// 自执行函数 -> umd - cmd
