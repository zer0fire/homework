const acorn = require("acorn");
const acornTs = require("acorn-typescript");
const fs = require("fs");
const path = require("path");

function walk(ast, callback) {
  for (const value in ast) {
    if (typeof ast[value] === "object") {
      callback.enter && callback.enter(ast[value]);
      // console.log(ast[value].type);
      walk(ast[value], callback);
      callback.leave && callback.leave(ast[value]);
    }
  }
}

function parse(str, options) {
  const Parser = acorn.Parser;
  const tsParser = Parser.extend(acornTs.tsPlugin());

  return tsParser.parse(
    str,
    Object.assign(
      {
        sourceType: "module",
        ecmaVersion: "latest",
        // here
        locations: true,
      },
      options
    )
  );
}

const str = fs.readFileSync(
  path.join(process.cwd(), "./extra/tsParser/example.ts")
);
const ast = parse(str);
const res = [];
walk(ast, {
  enter: (node) => {
    if (
      node.type === "PropertyDefinition" &&
      node.decorators &&
      node.decorators.length > 0
    ) {
      console.log(node);
      res.push(node);
    }
  },
});

console.log(res);
