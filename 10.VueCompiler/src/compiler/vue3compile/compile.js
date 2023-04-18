import { generate } from "./generate";
import { transform } from "./transform";
import { parse } from "../parse";
export function compile(template) {
  const originAst = parse(template);
  const wrapperAst = {
    type: "Root",
    children: originAst,
  };
  transform(wrapperAst);
  //   console.log(wrapperAst);
  const code = generate(wrapperAst.jsNode);
  return code;
}
