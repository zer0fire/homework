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

function parseHTML(str) {
  const EOF = Symbol("EOF");
  let currentToken = null;
  let currentAttribute = null;
  let canEmit = false;

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
      canEmit = true;
      return succeed;
    } else if (input === null) {
      throw new Error("unexpected-null-character parse error.");
    } else {
      currentToken = { type: "character", data: input };
      canEmit = true;
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
      data(input);
      // throw new Error("invalid-first-character-of-tag-name parse error.");
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
      canEmit = true;
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
    } else if (isAlphabet(input)) {
      currentAttribute = { name: "", value: "" };
      currentToken.attributes.push(currentAttribute);
      return attributeName(input);
    } else if (isGreaterThanSign(input)) {
      return afterAttributeName;
    }
  }
  function attributeName(input) {
    // class="container"
    //
    if (isSpace(input)) {
    } else if (isEqual(input)) {
    } else if (isAlphabet(input)) {
      currentAttribute.name += input.toLowerCase();
    }
  }
  function afterAttributeName(input) {}
  function beforeAttributeValue(input) {}
  function attributeValue(input) {}
  function afterAttributeValue(input) {}

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
  let value = "";
  let list = [];

  for (const input of str) {
    state = state(input);
  }
  state(EOF);
  console.log(value);
}
