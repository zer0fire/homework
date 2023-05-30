import { Token } from "doken";
import iconv from "iconv-lite";
import jschardet from "jschardet";

import pkg from "doken";
const { createTokenizer, regexRule } = pkg;

class Peekable {
  peekedItem: IteratorResult<
    Token<
      | "parenthesis"
      | "semicolon"
      | "prop_ident"
      | "c_value_type"
      | "invalid"
      | "_whitespace",
      string
    >
  >;
  iterator: IterableIterator<
    Token<
      | "parenthesis"
      | "semicolon"
      | "prop_ident"
      | "c_value_type"
      | "invalid"
      | "_whitespace",
      string
    >
  >;
  peeked: boolean;

  constructor(
    iterator: Generator<
      Token<
        | "parenthesis"
        | "semicolon"
        | "prop_ident"
        | "c_value_type"
        | "invalid"
        | "_whitespace",
        string
      >
    >
  ) {
    this.iterator = iterator[Symbol.iterator]();
    this.peekedItem = null!;
    this.peeked = false;
  }

  next() {
    let next = this.peeked ? this.peekedItem : this.iterator.next();

    this.peekedItem = null!;
    this.peeked = false;

    return next;
  }

  peek() {
    if (!this.peeked) {
      this.peekedItem = this.iterator.next();
      this.peeked = true;
    }

    return this.peekedItem;
  }
}

function _parseTokens(
  peekAbleTokens: Peekable,
  parentId: string | null,
  options: any = {}
) {
  let { getId, dictionary, onProgress, onNodeCreated } = options;

  let anchor: null | {
    id: any;
    data: any;
    parentId: any;
    children: any[];
  } = null;
  let node: {
    id: any;
    data: any;
    parentId: any;
    children: any[];
  } | null = null;
  let property: any = null;

  const res1 = peekAbleTokens.peek();
  while (res1 && !res1.done) {
    const res2 = peekAbleTokens.peek();
    let { type, value, row, col } = res2.value;

    if (type === "parenthesis" && value === "(") break;
    if (type === "parenthesis" && value === ")") {
      if (node != null) onNodeCreated({ node });
      return anchor;
    }

    if (type === "semicolon" || node == null) {
      // Prepare new node

      let lastNode: {
        id: any;
        data: any;
        parentId: any;
        children: any[];
      } | null = node;
      const newParentId: string = lastNode == null ? parentId : lastNode.id;
      node = {
        id: getId(),
        data: {},
        parentId: newParentId,
        children: [],
      };

      if (dictionary != null) dictionary[node.id] = node;

      if (lastNode != null) {
        onNodeCreated({ node: lastNode });
        lastNode.children.push(node);
      } else {
        anchor = node;
      }
    }

    if (type === "semicolon") {
      // Work is already done
    } else if (type === "prop_ident") {
      if (node != null) {
        // Prepare new property

        let identifier =
          value === value.toUpperCase()
            ? value
            : value
                .split("")
                .filter((x: string) => x.toUpperCase() === x)
                .join("");

        if (identifier !== "") {
          if (!(identifier in node.data)) node.data[identifier] = [];
          property = node.data[identifier];
        } else {
          property = null;
        }
      }
    } else if (type === "c_value_type") {
      if (property != null) {
        property.push(unescapeString(value.slice(1, -1)));
      }
    } else if (type === "invalid") {
      throw new Error(`Unexpected token at ${row + 1}:${col + 1}`);
    } else {
      throw new Error(
        `Unexpected token type '${type}' at ${row + 1}:${col + 1}`
      );
    }

    peekAbleTokens.next();
  }

  if (node == null) {
    anchor = node = {
      id: null,
      data: {},
      parentId: null,
      children: [],
    };
  } else {
    onNodeCreated({ node });
  }

  while (!peekAbleTokens.peek().done) {
    let { type, value, progress } = peekAbleTokens.peek().value;

    if (type === "parenthesis" && value === "(") {
      peekAbleTokens.next();

      let child = _parseTokens(peekAbleTokens, node.id, options);

      if (child != null) {
        node.children.push(child);
      }
    } else if (type === "parenthesis" && value === ")") {
      onProgress({ progress });
      break;
    }

    peekAbleTokens.next();
  }

  return anchor;
}
export const parseTokens = function (
  tokens: Generator<
    Token<
      | "parenthesis"
      | "semicolon"
      | "prop_ident"
      | "c_value_type"
      | "invalid"
      | "_whitespace",
      string
    >
  >,
  {
    getId = (
      (id: number): Function =>
      () =>
        id++
    )(0),
    dictionary = null,
    onProgress = () => {},
    onNodeCreated = () => {},
  } = {}
) {
  let node = _parseTokens(new Peekable(tokens), null, {
    getId,
    dictionary,
    onProgress,
    onNodeCreated,
  });

  return node && node.id == null ? node.children : [node];
};

export const parse = function (contents: string, options = {}) {
  return parseTokens(tokenizeIter(contents), options);
};

export const parseBuffer = function (buffer: Buffer, options: any = {}) {
  return parseTokens(
    tokenizeBufferIter(buffer, { encoding: options.encoding }),
    options
  );
};

const encodingDetectionProps = [
  "EV",
  "GN",
  "GC",
  "AN",
  "BT",
  "WT",
  "PW",
  "PB",
  "C",
];

const _tokenize = createTokenizer({
  rules: [
    regexRule("_whitespace", /\s+/y, { lineBreaks: true }),
    regexRule("parenthesis", /(\(|\))/y),
    regexRule("semicolon", /;/y),
    regexRule("prop_ident", /[A-Za-z]+/y),
    regexRule("c_value_type", /\[([^\\\]]|\\[^])*\]/y, { lineBreaks: true }),
    {
      type: "invalid",
      match: (input: string, position: number) => ({ length: 1 }),
    },
  ],
});

const tokenizeIter = function* (contents: string) {
  for (let token of _tokenize(contents)) {
    (token as any).progress = token.pos / (contents.length - 1);
    // delete token.length;

    yield token;
  }
  return null;
};

const tokenizeBufferIter = function* (
  buffer: Buffer,
  options: { encoding: string | null } = { encoding: null }
) {
  if (options.encoding != null) {
    yield* tokenizeIter(iconv.decode(buffer, options.encoding));
    return;
  }

  // Guess encoding

  let detectedEncoding = jschardet.detect(buffer.slice(0, 300)).encoding;
  let contents = iconv.decode(buffer, detectedEncoding);
  let tokens = tokenizeIter(contents);

  // Search for encoding

  let prelude: any[] = [];

  while (true) {
    let next = tokens.next();
    if (next.done) break;

    let { type, value } = next.value;
    let lastToken = prelude[prelude.length - 1];

    prelude.push(next.value);

    if (
      type === "c_value_type" &&
      lastToken != null &&
      lastToken.type === "prop_ident" &&
      lastToken.value === "CA"
    ) {
      options.encoding = unescapeString(value.slice(1, -1));
      break;
    }
  }

  if (
    options.encoding != null &&
    options.encoding != detectedEncoding &&
    iconv.encodingExists(options.encoding)
  ) {
    yield* tokenizeIter(iconv.decode(buffer, options.encoding));
  } else {
    yield* prelude;
    yield* tokens;
  }
};

const tokenize = (contents: string) => [...tokenizeIter(contents)];
const tokenizeBuffer = (buffer: Buffer, opts: any) => [
  ...tokenizeBufferIter(buffer, opts),
];

const unescapeString = function (input: string) {
  let result: string[] = [];
  let inBackslash = false;

  input = input.replace(/\r/g, "");

  for (let i = 0; i < input.length; i++) {
    if (!inBackslash) {
      if (input[i] !== "\\") result.push(input[i]);
      else if (input[i] === "\\") inBackslash = true;
    } else {
      if (input[i] !== "\n") result.push(input[i]);

      inBackslash = false;
    }
  }

  return result.join("");
};
