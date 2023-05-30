import { parseBuffer } from "./sgfParse.ts";
import fs from "fs";
import Path from "path";

const parseFile = function (filename: string, options = {}) {
  return parseBuffer(fs.readFileSync(filename), options);
};

console.log(
  JSON.stringify(parseFile(Path.join(process.cwd(), "./static/1.SGF")), null, 4)
);
