import { Node } from "acorn";
interface Callback {
  enter?: (node: Node) => void;
  leave?: (node: Node) => void;
}

function walk(ast: Node, callback?: Callback) {
  for (const value in ast) {
    if (typeof ast[value] === "object") {
      callback?.enter && callback?.enter(ast);
      walk(ast[value], callback);
      callback?.leave && callback?.leave(ast);
    }
  }
}

export default walk;
