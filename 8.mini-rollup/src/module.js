// 模块与模块之间引用处理，imports exports definitions
const { walk, Scope, analysis, MagicString } = require("../../3.walk/index.js");
const { parse } = require("acorn");
// import
// export
// 模块与模块之间引用处理，imports exports definitions
// const analyse = require("./analyse");
// const MagicString = require("magic-string");

// import
// export
// definitions

SYSTEM_VARIABLE = ["console", "log"];

const has = (obj, prop) => {
  return obj.hasOwnProperty(prop);
};

class Module {
  constructor({ code }) {
    // this.ast = parse(code, { ecmaVersion: 7, sourceType: "module" });
    // this.analyze();
    this.code = new MagicString(code);
    this.ast = parse(code, { ecmaVersion: "latest", sourceType: "module" });
    this.analyze();
  }
  analyze() {
    analysis(this.ast, this.code, this);
    this.imports = {};
    this.exports = {};
    this.definitions = {};
    // analyze defines dependsOn
    this.ast.body.forEach((node) => {
      if (node.type === "ImportDeclaration") {
        // console.log(node.source.value);

        for (let ImportSpecifier of node.specifiers) {
          const importObject = {
            localName: ImportSpecifier.local.name,
            name: ImportSpecifier.imported.name,
            source: node.source.value,
          };
          this.imports[ImportSpecifier.local.name] = importObject;
          //   ImportSpecifier.imported.name;
          //   ImportSpecifier.local.name;
        }
      }
      //   具名导出
      if (node.type === "ExportNamedDeclaration") {
        for (const VariableDeclarator of node.declaration.declarations) {
          if (VariableDeclarator.type === "VariableDeclarator") {
            this.exports[VariableDeclarator.id.name] = {
              localName: VariableDeclarator.id.name,
              node,
              expression: node.declaration,
            };
          }
        }
      }
      //   默认导出
      if (node.type === "ExportDefaultDeclaration") {
      }
      if (node.type === "VariableDeclaration") {
        for (const VariableDeclarator of node.declarations) {
          this.definitions[VariableDeclarator.id.name] = node;
        }
      }

      //   analysis(this.ast, this.code, this);
      // // 所有 ast 节点上都添加了 _defines
      // this.ast.body.forEach((statement) => {
      //   Object.keys(statement._defines).map((name) => {
      //     this.definitions[name] = statement;
      //   });
      // });
    });
  }
  expandAllStatement() {
    // const expressionStatement = [];
    const allStatements = [];
    // const declarations = {};
    // analyze
    this.ast.body.forEach((node) => {
      if (
        node.type === "ImportDeclaration" ||
        node.type === "ExportNamedDeclaration" ||
        node.type === "ExportDefaultDeclaration" ||
        node.type === "VariableDeclaration"
      ) {
        return;
      }
      if (node.type === "ExpressionStatement") {
        const statements = this.expandStatement(node);
        allStatements.push(...statements);
      }
    });
    return allStatements;
  }
  expandStatement(node) {
    const statements = [];
    const dependsOn = node._dependsOn;
    Object.keys(dependsOn).forEach((key) => {
      statements.push(...this.define(key));
    });
    statements.push(node);
    // 有可能需要展开后再展开，define 里调用 expandStatement 的情况
    return statements;
  }
  define(name) {
    // 其他情况：比如 console.log
    // const ret = [];
    const statement = this.definitions[name];
    if (statement) {
      if (!statement._include) {
        statement._include = true;
        // ret.push(statement);
        return this.expandStatement(statement);
      } else {
        return [];
      }
    } else if (SYSTEM_VARIABLE.includes(name)) {
      return [];
    } else {
      throw new Error(`变量${name}未定义或未导入`);
    }
  }
}

module.exports = Module;

// 变量引用透明原则

