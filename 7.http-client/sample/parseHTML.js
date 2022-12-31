// https://html.spec.whatwg.org/multipage/parsing.html#data-state
//
function isUpperAlpha(input) {
  return (
    input.charCodeAt() < "Z".charCodeAt() && input.charCodeAt() > "A".charCodeAt
  );
}
function isLowerAlpha(input) {
  return (
    input.charCodeAt() < "z".charCodeAt() && input.charCodeAt() > "a".charCodeAt
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

function isQuotationMark(input) {
  return input === '"';
}
function isApostrophe(input) {
  return input === "'";
}

function parseHTML(str) {
  const EOF = Symbol("EOF");
  let currentToken = null;
  let currentAttribute = null;
  let stack = [];
  let mode = "DATA";
  // RCDATA, RAWTEXT, SCRIPTDATA, PLAINTEXT CDATA

  function emit(token) {
    stack.push(token);
  }

  function succeed() {
    throw new Error("illegal succeed call");
  }

  function characterReference() {}
  function markupDeclarationOpen() {}

  function start(input) {
    if (isAmpersand(input)) {
      return characterReference;
    } else if (isLessThanSign(input)) {
      return tagOpen;
    } else if (input === EOF) {
      currentToken = { type: EOF };
      emit(currentToken);
      return succeed;
    } else if (input === null) {
      throw new Error("unexpected-null-character parse error.");
    } else {
      currentToken = { type: "character", data: input };
      emit(currentToken);
      return start;
    }
  }

  function tagOpen(input) {
    if (isExclamationMark(input)) {
      return markupDeclarationOpen;
    } else if (isSolidus(input)) {
      return endTagOpen;
    } else if (isAlphabet(input)) {
      currentToken = { type: "start tag", tagName: "", attributes: [] };
      return tagName(input);
    } else if (isQuestionMark(input)) {
      throw new Error(
        "unexpected-question-mark-instead-of-tag-name parse error."
      );
    } else if (input === EOF) {
      throw new Error("eof-before-tag-name parse error.");
      // Emit (发出) a U+003C LESS-THAN SIGN character (字符) token and an end-of-file token.
    } else {
      console.error("invalid-first-character-of-tag-name parse error.");
      start(input);
      // Emit (发出) a U+003C LESS-THAN SIGN character (字符) token. Reconsume in the data state.
    }
  }

  function endTagOpen(input) {
    if (isAlphabet(input)) {
      currentToken = { type: "end tag", tagName: "", attributes: [] };
      return tagName(input);
    } else {
      throw new Error("parse error: invalid-first-character-of-tagName");
    }
  }

  function tagName(input) {
    if (isSpace(input)) {
      return beforeAttributeName;
    } else if (isSolidus(input)) {
    } else if (isGreaterThanSign(input)) {
      if (currentToken.tagName === "textarea") {
        mode = "RCDATA";
      }
      emit(currentToken);
      return start;
    } else if (isUpperAlpha(input)) {
      currentToken.tagName += input.toLowerCase();
      return tagName;
    } else if (input === null) {
      // unexpected-null-character parse error.
      // Append a U+FFFD REPLACEMENT (更换) CHARACTER (字符) CHARACTER (字符)
      // to the current tag token's tag name.
    } else if (input === EOF) {
      // eof-in-tag parse error. Emit (发出) an end-of-file token.
    } else {
      currentToken.tagName += input;
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
      currentAttribute = { name: "", value: "" };
      currentToken.attributes.push(currentAttribute);
      return attributeName(input);
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
      return afterAttributeName(input);
    } else if (isEqual(input)) {
      return beforeAttributeValue;
    } else if (isUpperAlpha(input)) {
      currentAttribute.name += input.toLowerCase();
    } else if (input === null) {
      throw new Error("unexpected-null-character parse error.");
    } else if (
      isQuestionMark(input) ||
      isApostrophe(input) ||
      isLessThanSign(input)
    ) {
    } else {
      currentAttribute.name += input;
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
      return start;
    } else if (input === EOF) {
      throw new Error("eof-in-tag parse error.");
    } else {
      currentAttribute = { name: "", value: "" };
      currentToken.attributes.push(currentAttribute);
      return attributeName(input);
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
      return attributeValueUnquote(input);
    }
  }

  function attributeValueDoubleQuote(input) {
    if (isQuotationMark(input)) {
      return afterAttributeValue;
    } else if (isAmpersand(input)) {
    } else if (input === null) {
    } else if (input === EOF) {
    } else {
      currentAttribute.value += input;
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
      currentAttribute.value += input;
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
      if (currentToken.tagName === "textarea") {
        mode = "RCDATA";
      }
      emit(currentToken);
      return start;
    } else if (input === EOF) {
      console.error("eof-in-tag parse error.");
      return;
    } else {
      console.error("missing-whitespace-between-attributes parse error.");
      return beforeAttributeName(input);
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

  let state = start();

  for (const input of str) {
    state = state(input);
  }
  state(EOF);
  console.log(value);
}
