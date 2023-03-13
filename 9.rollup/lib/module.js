// 模块与模块之间引用处理，imports exports definitions
const { parse } = require("acorn");
const analyse = require("./analyse");
const MagicString = require("magic-string");

// import
// export
// definitions

SYSTEM_VARIABLE = ["console", "log"];

const has = (obj, prop) => {
  return obj.hasOwnProperty(prop);
};

class Module {
  constructor({ code, path, bundle }) {
    // this.ast = parse(code, { ecmaVersion: 7, sourceType: "module" });
    // this.analyze();
    this.code = new MagicString(code, { filename: path });
    // console.log({ name: "module constructor", code });
    this.ast = parse(code, { ecmaVersion: "latest", sourceType: "module" });
    this.analyze();
    this.bundle = bundle;
    this.path = path;
  }
  analyze() {
    analyse(this.ast, this.code, this);

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
            // console.log(this.exports);
          }
        }
      }
      //   默认导出
      if (node.type === "ExportDefaultDeclaration") {
      }
      // if (node.type === "VariableDeclaration") {
      //   for (const VariableDeclarator of node.declarations) {
      //     this.definitions[VariableDeclarator.id.name] = node;
      //   }
      // }

      this.definitions = {}; // 找到定义语句
      // 遍历找出每一个节点中的定义语句
      this.ast.body.forEach((statement) => {
        Object.keys(statement._defines).forEach((name) => {
          // 变量名对应的语句
          this.definitions[name] = statement;
        });
      });
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
    // console.log(allStatements[0]._source);
    return allStatements;
  }
  expandStatement(node) {
    const statements = [];
    const dependsOn = node._dependsOn;
    Object.keys(dependsOn).forEach((key) => {
      statements.push(...this.define(key));
    });
    statements.push(node);
    return statements;
  }
  define(name) {
    // 其他情况：比如 console.log
    // const ret = [];
    // TODO: 有可能给的 name 不是在本模块，因此先在 imports 语句里获取，然后 fetchModule
    // 这里的 fetchModule 是在 bundle 上，绑定到 Module 里
    // dependency Graph

    if (this.imports[name]) {
      const module = this.bundle.fetchModule(
        this.imports[name].source,
        this.path
      );

      const exportData = module.exports[this.imports[name].name];
      // ret[0]._source
      const ret = module.define(exportData.localName);
      return ret;
    } else {
      if (this.definitions[name]) {
        let statement = this.definitions[name];
        if (!statement._include) {
          statement._include = true;
          return this.expandStatement(statement);
        } else {
          return [];
        }
      } else if (SYSTEM_VARIABLE.includes(name)) {
        return [];
      } else {
        throw new Error(`变量 ${name} 未定义或未导入`);
      }
    }
  }
}

module.exports = Module;

// 变量引用透明原则
