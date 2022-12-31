const EOF = Symbol("EOF");

class HTMLParser {
  constructor() {
    this.state = data;
    this.currentToken = null;
    this.currentAttribute = null;
    this.stack = [];
    this.mode = "DATA";
    // RCDATA, RAWTEXT, SCRIPTDATA, PLAINTEXT CDATA
  }
  end(input) {}
  write(data) {
    for (let i = 0; i < data.length; i++) {
      console.log(this.state.name, data[i]);
      // console.log(data[i]);
      this.state = this.state.call(this, data[i].toString());
    }
  }
}

// https://html.spec.whatwg.org/multipage/parsing.html#data-state
//
function isUpperAlpha(input) {
  return (
    input.charCodeAt() < "Z".charCodeAt() &&
    input.charCodeAt() > "A".charCodeAt()
  );
}
function isLowerAlpha(input) {
  return (
    input.charCodeAt() < "z".charCodeAt() &&
    input.charCodeAt() > "a".charCodeAt()
  );
}

function isAlphabet(input) {
  return isUpperAlpha(input) || isLowerAlpha(input);
}

function isTabulation(input) {
  return input === "\t";
}
function isLineFeed(input) {
  return input === "\r";
}
function isFormFeed(input) {
  return input === "\n";
}
function isSpace(input) {
  return (
    input.charCodeAt() === "\t".charCodeAt() ||
    input.charCodeAt() === "\n".charCodeAt ||
    input.charCodeAt() === "\r".charCodeAt() ||
    input.charCodeAt() === " ".charCodeAt
  );
}

function isExclamationMark(input) {
  return input === "!";
}

function isEqual(input) {
  return input === "=";
}

function isLessThanSign(input) {
  return input === "<";
}
function isGreaterThanSign(input) {
  return input === ">";
}

function isQuestionMark(input) {
  return input === "?";
}

function isSolidus(input) {
  return input === "/";
}

function isAmpersand(input) {
  return input === "&";
}

function isQuotationMark(input) {
  return input === '"';
}
function isApostrophe(input) {
  return input === "'";
}

function emit(token) {
  this.stack.push(token);
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
}
function markupDeclarationOpen() {}

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
    this.currentToken = { type: EOF };
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
    console.log("====currentToken", this.currentToken);
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
    console.log(this.currentToken, input);
    this.currentToken.tagName += input;
    return tagName;
  }
}

function beforeAttributeName(input) {
  if (isSpace(input)) {
    return beforeAttributeName;
  } else if (isSolidus(input) || isGreaterThanSign(input) || input === EOF) {
    return afterAttributeName(input);
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
  } else if (input === null) {
    throw new Error("unexpected-null-character parse error.");
  } else if (
    isQuestionMark(input) ||
    isApostrophe(input) ||
    isLessThanSign(input)
  ) {
  } else {
    this.currentAttribute.name += input;
  }
}
function selfClosingStartTag() {
  return selfClosingStartTag;
}
function afterAttributeName(input) {
  if (isSpace(input)) {
    return afterAttributeName;
  } else if (isSolidus(input)) {
    return selfClosingStartTag;
  } else if (isEqual(input)) {
    return beforeAttributeValue;
  } else if (isGreaterThanSign(input)) {
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
    console.error("eof-in-tag parse error.");
    return;
  } else {
    console.error("missing-whitespace-between-attributes parse error.");
    return beforeAttributeName.call(this, input);
  }
}

function getTextNode(input) {
  if (input === EOF) {
    return succeed;
  } else if (isAlphabet(input)) {
    return getTextNode;
  } else if (isLessThanSign(input)) {
    return tagStart;
  }
}

const parser = new HTMLParser();
parser.write("<div></div>");

module.exports = HTMLParser;
