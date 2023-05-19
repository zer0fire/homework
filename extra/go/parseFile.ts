import { parseBuffer } from "./sgfParse.ts";
import fs from "fs";

const parseFile = function (filename: string, options = {}) {
  return parseBuffer(fs.readFileSync(filename), options);
};

console.log(JSON.stringify(parseFile("./1.SGF"), null, 4));
