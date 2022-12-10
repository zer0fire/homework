function isAlphabet(input) {
  return /^[a-zA-Z]$/.test(input);
}
function isSpace(input) {
  return /^[\t\n\f ]$/.test(input);
}

function isEqual(input) {
  return input === "=";
}

function isEqual(input) {
  return input === "=";
}

function isLeftAngleBracket(input) {
  return input === "<";
}
function isRightAngleBracket(input) {
  return input === ">";
}

function parseHTML(str) {
  const EOF = Symbol("EOF");
  let currentToken = null;
  let currentAttribute = null;
  let canEmit = false;

  function succeed() {
    throw new Error("illegal succeed call");
  }

  function start(input) {
    if (isLeftAngleBracket(input)) {
      return tagOpen;
    } else if (input === EOF) {
      return succeed;
    } else {
      currentToken = { type: "character", data: input };
      canEmit = true;
      return start;
    }
  }

  function tagOpen(input) {
    if (input === "/") {
      return endTagOpen;
    } else if (isAlphabet(input)) {
      currentToken = { type: "start tag", tagName: "", attributes: [] };
      return tagName(input);
    } else {
      throw new Error("parse error: invalid-first");
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
    } else if (isRightAngleBracket(input)) {
      canEmit = true;
      return start;
    } else {
      currentToken.tagName += input.toLowerCase();
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
    } else if (isRightAngleBracket(input)) {
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
    } else if (isLeftAngleBracket(input)) {
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
