const EOF = Symbol("EOF");

// PPT -> VB -> SVG -> 操作节点 -> 改变颜色

// https://html.spec.whatwg.org/multipage/parsing.html#data-state
//
function isUpperAlpha(input) {
  if (typeof input !== "string") return false;
  return (
    input.charCodeAt() < "Z".charCodeAt() &&
    input.charCodeAt() > "A".charCodeAt()
  );
}
function isLowerAlpha(input) {
  if (typeof input !== "string") return false;
  return (
    input.charCodeAt() < "z".charCodeAt() &&
    input.charCodeAt() > "a".charCodeAt()
  );
}

function isAlphabet(input) {
  if (typeof input !== "string") return false;
  return isUpperAlpha(input) || isLowerAlpha(input);
}

function isTabulation(input) {
  if (typeof input !== "string") return false;
  return input === "\t";
}
function isLineFeed(input) {
  if (typeof input !== "string") return false;
  return input === "\r";
}
function isFormFeed(input) {
  if (typeof input !== "string") return false;
  return input === "\n";
}

function isSpaceChar(input) {
  if (typeof input !== "string") return false;
  return input === " ";
}
function isSpace(input) {
  if (typeof input !== "string") return false;
  return (
    isTabulation(input) ||
    isFormFeed(input) ||
    isLineFeed(input) ||
    isSpaceChar(input)
  );
}

function isExclamationMark(input) {
  if (typeof input !== "string") return false;
  return input === "!";
}

function isEqual(input) {
  if (typeof input !== "string") return false;
  return input === "=";
}

function isLessThanSign(input) {
  if (typeof input !== "string") return false;
  return input === "<";
}
function isGreaterThanSign(input) {
  if (typeof input !== "string") return false;
  return input === ">";
}

function isQuestionMark(input) {
  if (typeof input !== "string") return false;
  return input === "?";
}

function isSolidus(input) {
  if (typeof input !== "string") return false;
  return input === "/";
}

function isAmpersand(input) {
  if (typeof input !== "string") return false;
  return input === "&";
}

function isQuotationMark(input) {
  if (typeof input !== "string") return false;
  return input === '"';
}
function isApostrophe(input) {
  if (typeof input !== "string") return false;
  return input === "'";
}

function emit(token) {
  this.stack.push(token);
  this.syntaxParser.write(token);
  // this.trigger('data')
}

function succeed() {
  throw new Error("illegal succeed call");
}

function characterReference(input) {
  // reconsume named
  // return state
  // if () {
  // } else {
  //   return this.returnState(input)
  // }
  // return characterReference;
  throw new Error("characterReference not complete");
}
function markupDeclarationOpen() {
  // return markupDeclarationOpen;
  throw new Error("markupDeclarationOpen not complete");
}

function data(input) {
  if (isAmpersand(input)) {
    this.returnState = data;
    // &amp;
    // attributeReferenceState
    // dataReferenceState
    return characterReference;
  } else if (isLessThanSign(input)) {
    return tagOpen;
  } else if (input === EOF) {
    this.currentToken = { type: "EOF" };
    emit.call(this, this.currentToken);
    return succeed;
  } else if (input === null) {
    throw new Error("unexpected-null-character parse error.");
  } else {
    this.currentToken = { type: "character", data: input };
    emit.call(this, this.currentToken);
    return data;
  }
}

function tagOpen(input) {
  if (isExclamationMark(input)) {
    return markupDeclarationOpen;
  } else if (isSolidus(input)) {
    return endTagOpen;
  } else if (isAlphabet(input)) {
    this.currentToken = { type: "start tag", tagName: "", attributes: [] };
    // console.log("====currentToken", this.currentToken);
    return tagName.call(this, input);
  } else if (isQuestionMark(input)) {
    throw new Error(
      "unexpected-question-mark-instead-of-tag-name parse error."
    );
  } else if (input === EOF) {
    throw new Error("eof-before-tag-name parse error.");
    // Emit (发出) a U+003C LESS-THAN SIGN character (字符) token and an end-of-file token.
  } else {
    console.error("invalid-first-character-of-tag-name parse error.");
    data.call(this, input);
    // Emit (发出) a U+003C LESS-THAN SIGN character (字符) token. Reconsume in the data state.
  }
}

function endTagOpen(input) {
  if (isAlphabet(input)) {
    this.currentToken = { type: "end tag", tagName: "", attributes: [] };
    return tagName.call(this, input);
  } else {
    throw new Error("parse error: invalid-first-character-of-tagName");
  }
}

function tagName(input) {
  if (isSpace(input)) {
    return beforeAttributeName;
  } else if (isSolidus(input)) {
    return selfClosingStartTag;
  } else if (isGreaterThanSign(input)) {
    if (this.currentToken.tagName === "textarea") {
      mode = "RCDATA";
    }
    emit.call(this, this.currentToken);
    return data;
  } else if (isUpperAlpha(input)) {
    this.currentToken.tagName += input.toLowerCase();
    return tagName;
  } else if (input === null) {
    // unexpected-null-character parse error.
    // Append a U+FFFD REPLACEMENT (更换) CHARACTER (字符) CHARACTER (字符)
    // to the current tag token's tag name.
  } else if (input === EOF) {
    // eof-in-tag parse error. Emit (发出) an end-of-file token.
  } else {
    // console.log(this.currentToken, input);
    this.currentToken.tagName += input;
    return tagName;
  }
}

function beforeAttributeName(input) {
  if (isSpace(input)) {
    return beforeAttributeName;
  } else if (isSolidus(input) || isGreaterThanSign(input) || input === EOF) {
    return afterAttributeName.call(this, input);
  } else if (isEqual(input)) {
    throw new Error(
      "unexpected-equals-sign-before-attribute-name parse error."
    );
  } else {
    this.currentAttribute = { name: "", value: "" };
    this.currentToken.attributes.push(this.currentAttribute);
    return attributeName.call(this, input);
  }
}
function attributeName(input) {
  // class="container"
  //
  if (
    isSpace(input) ||
    isSolidus(input) ||
    isGreaterThanSign(input) ||
    input === EOF
  ) {
    return afterAttributeName.call(this, input);
  } else if (isEqual(input)) {
    return beforeAttributeValue;
  } else if (isUpperAlpha(input)) {
    this.currentAttribute.name += input.toLowerCase();
    return attributeName;
  } else if (input === null) {
    throw new Error("unexpected-null-character parse error.");
  } else if (
    isQuestionMark(input) ||
    isApostrophe(input) ||
    isLessThanSign(input)
  ) {
  } else {
    this.currentAttribute.name += input;
    return attributeName;
  }
}
function selfClosingStartTag(input) {
  if (isGreaterThanSign(input)) {
    this.currentToken.isSelfClosingTag = true;
    emit.call(this, this.currentToken);
    return data;
  } else if (input === EOF) {
    throw new Error("eof-in-tag parse error.");
  } else {
    console.error("unexpected-solidus-in-tag parse error.");
    return beforeAttributeName.call(this, input);
  }
}
function afterAttributeName(input) {
  if (isSpace(input)) {
    return afterAttributeName;
  } else if (isSolidus(input)) {
    return selfClosingStartTag;
  } else if (isEqual(input)) {
    return beforeAttributeValue;
  } else if (isGreaterThanSign(input)) {
    emit.call(this, this.currentToken);

    return data;
  } else if (input === EOF) {
    throw new Error("eof-in-tag parse error.");
  } else {
    this.currentAttribute = { name: "", value: "" };
    this.currentToken.attributes.push(this.currentAttribute);
    return attributeName.call(this, input);
  }
}
function beforeAttributeValue(input) {
  if (isSpace(input)) {
    return beforeAttributeValue;
  } else if (isQuotationMark(input)) {
    return attributeValueDoubleQuote;
  } else if (isApostrophe(input)) {
    return attributeValueSingleQuote;
  } else if (isGreaterThanSign(input)) {
    throw new Error("missing-attribute-value parse error.");
  } else {
    return attributeValueUnquote.call(this, input);
  }
}

function attributeValueDoubleQuote(input) {
  if (isQuotationMark(input)) {
    return afterAttributeValue;
  } else if (isAmpersand(input)) {
  } else if (input === null) {
  } else if (input === EOF) {
  } else {
    this.currentAttribute.value += input;
    return attributeValueDoubleQuote;
  }
}
function attributeValueSingleQuote(input) {
  if (isApostrophe(input)) {
    return afterAttributeValue;
  } else if (isAmpersand(input)) {
  } else if (input === null) {
  } else if (input === EOF) {
  } else {
    this.currentAttribute.value += input;
    return attributeValueSingleQuote;
  }
}
// function attributeValueUnquote(input) {
//   if (is) {
//   } else if (isAmpersand(input)) {
//   } else if (input === null) {
//   } else if (input === EOF) {
//   } else {
//   }
// }
// function attributeValue(input) {}
function afterAttributeValue(input) {
  if (isSpace(input)) {
    return beforeAttributeName;
  } else if (isSolidus(input)) {
    return selfClosingStartTag;
  } else if (isGreaterThanSign(input)) {
    if (this.currentToken.tagName === "textarea") {
      mode = "RCDATA";
    }
    emit.call(this, this.currentToken);
    return data;
  } else if (input === EOF) {
    throw new Error("eof-in-tag parse error.");
    // return
  } else {
    console.error("missing-whitespace-between-attributes parse error.");
    return beforeAttributeName.call(this, input);
  }
}

class HTMLParser {
  constructor() {
    this.state = data;
    this.currentToken = null;
    this.currentAttribute = null;
    this.stack = [];
    this.mode = "DATA";
    this.syntaxParser = new HtmlSyntaxParser();
    // RCDATA, RAWTEXT, SCRIPTDATA, PLAINTEXT CDATA
  }
  end() {
    this.state.call(this, EOF);
    // this.trigger('end')
  }
  write(data) {
    for (let i = 0; i < data.length; i++) {
      // console.log(this.state.name, data[i]);
      // console.log(data[i]);
      this.state = this.state.call(this, data[i].toString());
    }
    this.end();
    // LR(0)
    // LL(n)
    // Lex 词法 + Syntax 句法 = Grammar 语法
    // Lex 词法 + Syntax 语法 = Grammar 文法
    // Chunked Html lexer 词法
    // lex character => token
  }
}

class HtmlSyntaxParser {
  constructor() {
    this.stack = [{ type: "document", children: [] }];
    this.text = null;
  }

  write(token) {
    // p 与 p 之间
    // xhtml
    // console.log(JSON.stringify(this.stack));
    // leetcode 括号匹配
    // 状态机 -> kmp -> 自动生成状态机 -> 多层状态机 -> html lr0
    if (token.type === "start tag") {
      this.text = null;
      const parent = this.stack[this.stack.length - 1];
      const element = {
        type: "element",
        tagName: token.tagName,
        children: [],
      };
      parent.children.push(element);
      // element.parent = parent;
      this.stack.push(element);
    } else if (token.type === "end tag") {
      this.text = null;
      if (this.stack[this.stack.length - 1].tagName !== token.tagName) {
        throw new Error("tag not match");
      }
      this.stack.pop();
    } else if (token.type === "character") {
      if (this.text === null) {
        const parent = this.stack[this.stack.length - 1];
        this.text = { type: "text", content: "" };
        parent.children.push(this.text);
        // this.text.parent = parent;
      }
      this.text.content += token.data;
    }
  }
}

// [
//   {
//     type: "document",
//     children: [
//       {
//         type: "element",
//         tagName: "div",
//         children: [{ type: "text", content: "text" }],
//       },
//     ],
//   },
// ];
const parser = new HTMLParser();
parser.write(`<div checked>text</div>`);

module.exports = {
  HTMLParser,
  isAlphabet,
  isAmpersand,
  isApostrophe,
  isEqual,
  isExclamationMark,
  isFormFeed,
  isGreaterThanSign,
  isLessThanSign,
  isLineFeed,
  isLowerAlpha,
  isQuestionMark,
  isQuotationMark,
  isSolidus,
  isSpace,
  isSpaceChar,
  isTabulation,
  isUpperAlpha,
  succeed,
  EOF,
};

// 可以测试
// 全局变量 - store
// RxJs + Vue React
// UI 和 State
// State 和 State
// Model 联动 Rxjs
// V-Model 联动 Vue 不应该存储
// view 机制 - 布道 - cr 也是可以交接任务等等的前提
// 互相学习、互相理解业务、
// cr 可以单元测试
// 先规定不能做什么，赏罚

// type -> 单测 -> cr -> 架构单测隔离

// 企业系统、orm、财务人力等等
// 一致性
// 阿里 P8 叔叔 Rxjs
// 康神 完美技术顾问 清华

// 状态机 -> kmp -> 自动生成状态机 -> 多层状态机 -> html lr0
// KMP 复习
