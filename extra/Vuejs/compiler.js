const TextModes = {
  DATA: "DATA",
  RCDATA: "RCDATA",
  RAWTEXT: "RAWTEXT",
  CDATA: "CDATA",
};

function parse(str) {
  const context = {
    source: str,
    mode: TextMode.DATA,
  };
  const nodes = parseChildren(context, []);
  return {
    type: "Root",
    children: nodes,
  };
}

function parseChildren(context, ancestors) {
  let nodes = [];
  const { mode, source } = context;

  while (!isEnd(context, ancestors)) {
    let node;
    if (mode === TextModes.DATA || mode === TextModes.RCDATA) {
      if (mode === TextModes.DATA && source[0] === "<") {
        if (source[1] === "!") {
          if (source.startsWith("<!--")) {
            node = parseComment(context);
          } else if (source.startsWith("<![CDATA[")) {
            node = parseCDATA(context, ancestors);
          }
        } else if (source[1] === "/") {
          // 结束标签
        } else if (/[a-z]/i.test(source[1])) {
          node = parseElement(context, ancestors);
        }
      } else if (source.startsWith("{{")) {
        node = parseInterpolation(context);
      }
    }
    if (!node) {
      node = parseText(context);
    }
    nodes.push(node);
  }
  return nodes;
}
