import * as acorn from "acorn";
import { tsPlugin } from "acorn-typescript";
import { readFileSync, statSync } from "node:fs";
import { extname } from "node:path";

const parser = acorn.Parser;
const tsParser = acorn.Parser.extend(tsPlugin() as any);

export function parse(path: string, options?: acorn.Options): acorn.Node {
  const state = statSync(path);
  if (!state.isFile) {
    throw new Error("Wrong Path");
  }
  let tail = extname(path);
  let parseMachine: typeof acorn.Parser | null = null;
  if (tail === ".ts") {
    parseMachine = tsParser;
  } else if (tail === ".js") {
    parseMachine = parser;
  }
  const buffer = readFileSync(path);
  const str = buffer.toString();

  return parseMachine.parse(
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
