const {
  HTMLParser,
  isUpperAlpha,
  isLowerAlpha,
  isTabulation,
  isLineFeed,
  isFormFeed,
  isSpaceChar,
  isQuestionMark,
  isQuotationMark,
  isApostrophe,
  succeed,
  EOF,
} = require("../htmlParser");

function testCase(html, result) {
  const parser = new HTMLParser();
  parser.write(html);
  if (JSON.stringify(parser.stack) !== JSON.stringify(result)) {
    console.log(JSON.stringify(parser.stack));
  }
  expect(JSON.stringify(parser.stack)).toEqual(JSON.stringify(result));
  // console.log(JSON.stringify(parser.syntaxParser.stack));
}

// eof-before-tag-name parse error.
function mustThrow(html, errorType) {
  const parser = new HTMLParser();
  try {
    parser.write(html);
  } catch (e) {
    expect(e.message).toEqual(errorType);
  }
}

function mustLog(html, logContent) {
  const parser = new HTMLParser();
  try {
    parser.write(html);
  } catch (e) {
    expect(e.message).toEqual(errorType);
  }
}
// TODO: unreached code: null、log error、mode
describe("parse html", () => {
  test("test util", () => {
    expect(isUpperAlpha(EOF)).toEqual(false);
    expect(isLowerAlpha(EOF)).toEqual(false);
    expect(isTabulation(EOF)).toEqual(false);
    expect(isLineFeed(EOF)).toEqual(false);
    expect(isFormFeed(EOF)).toEqual(false);
    expect(isSpaceChar(EOF)).toEqual(false);
    expect(isQuestionMark(EOF)).toEqual(false);
    expect(isQuotationMark(EOF)).toEqual(false);
    expect(isApostrophe(EOF)).toEqual(false);
    try {
      succeed();
    } catch (e) {
      expect(e.message).toEqual("illegal succeed call");
    }
  });
  test("one tag", () => {
    testCase("<div></div>", [
      { type: "start tag", tagName: "div", attributes: [] },
      { type: "end tag", tagName: "div", attributes: [] },
      { type: "EOF" },
    ]);
  });
  test("one tag with upper alphabet", () => {
    testCase("<Div></div>", [
      { type: "start tag", tagName: "div", attributes: [] },
      { type: "end tag", tagName: "div", attributes: [] },
      { type: "EOF" },
    ]);
  });
  test("one tag with text", () => {
    testCase("<div>text</div>", [
      { type: "start tag", tagName: "div", attributes: [] },
      { type: "character", data: "t" },
      { type: "character", data: "e" },
      { type: "character", data: "x" },
      { type: "character", data: "t" },
      { type: "end tag", tagName: "div", attributes: [] },
      { type: "EOF" },
    ]);
  });
  test("one tag has attributes and has a text node children", () => {
    testCase('<div class="class1">text</div>', [
      {
        type: "start tag",
        tagName: "div",
        attributes: [{ name: "class", value: "class1" }],
      },
      { type: "character", data: "t" },
      { type: "character", data: "e" },
      { type: "character", data: "x" },
      { type: "character", data: "t" },
      { type: "end tag", tagName: "div", attributes: [] },
      { type: "EOF" },
    ]);
  });
  test("one tag with attributes has a node children has attributes", () => {
    testCase('<div class="class1"><span class="class2"></span></div>', [
      {
        type: "start tag",
        tagName: "div",
        attributes: [{ name: "class", value: "class1" }],
      },
      {
        type: "start tag",
        tagName: "span",
        attributes: [{ name: "class", value: "class2" }],
      },
      { type: "end tag", tagName: "span", attributes: [] },
      { type: "end tag", tagName: "div", attributes: [] },
      { type: "EOF" },
    ]);
  });
  test("one tag has a node children", () => {
    testCase("<div><span></span></div>", [
      { type: "start tag", tagName: "div", attributes: [] },
      { type: "start tag", tagName: "span", attributes: [] },
      { type: "end tag", tagName: "span", attributes: [] },
      { type: "end tag", tagName: "div", attributes: [] },
      { type: "EOF" },
    ]);
  });
  test("one tag has a node children, node children has a text children", () => {
    testCase("<div><span>text</span></div>", [
      { type: "start tag", tagName: "div", attributes: [] },
      { type: "start tag", tagName: "span", attributes: [] },
      // 文本节点拆开和合并都可以。拆开可以适配网络和大文件
      // test case 太薄了，必须要有 testCase 和 mustThrow 这个层级，
      // 甚至对 ui、框架、交互等等的抽象
      { type: "character", data: "t" },
      { type: "character", data: "e" },
      { type: "character", data: "x" },
      { type: "character", data: "t" },
      { type: "end tag", tagName: "span", attributes: [] },
      { type: "end tag", tagName: "div", attributes: [] },
      // Symbol 不打印，结果属性也没了，是 node 的问题
      { type: "EOF" },
    ]);
  });
  test("one tag with class attribute has a text children", () => {
    testCase("<div class='class1'>text</div>", [
      {
        type: "start tag",
        tagName: "div",
        attributes: [{ name: "class", value: "class1" }],
      },
      { type: "character", data: "t" },
      { type: "character", data: "e" },
      { type: "character", data: "x" },
      { type: "character", data: "t" },
      { type: "end tag", tagName: "div", attributes: [] },
      { type: "EOF" },
    ]);
  });
  test("one tag has a no value attribute", () => {
    testCase("<div checked>text</div>", [
      {
        type: "start tag",
        tagName: "div",
        attributes: [{ name: "checked", value: "" }],
      },
      { type: "character", data: "t" },
      { type: "character", data: "e" },
      { type: "character", data: "x" },
      { type: "character", data: "t" },
      { type: "end tag", tagName: "div", attributes: [] },
      { type: "EOF" },
    ]);
  });
  test("one tag has a two attributes", () => {
    testCase('<div class="class1" id="id1">text</div>', [
      {
        type: "start tag",
        tagName: "div",
        attributes: [
          { name: "class", value: "class1" },
          { name: "id", value: "id1" },
        ],
      },
      { type: "character", data: "t" },
      { type: "character", data: "e" },
      { type: "character", data: "x" },
      { type: "character", data: "t" },
      { type: "end tag", tagName: "div", attributes: [] },
      { type: "EOF" },
    ]);
    testCase('<div class="class1" ID="id1">text</div>', [
      {
        type: "start tag",
        tagName: "div",
        attributes: [
          { name: "class", value: "class1" },
          { name: "id", value: "id1" },
        ],
      },
      { type: "character", data: "t" },
      { type: "character", data: "e" },
      { type: "character", data: "x" },
      { type: "character", data: "t" },
      { type: "end tag", tagName: "div", attributes: [] },
      { type: "EOF" },
    ]);
  });
  test("one tag has a two attributes, attributes has space", () => {
    testCase('<div checked class = " class1"  id="id1">text</div>', [
      {
        type: "start tag",
        tagName: "div",
        attributes: [
          { name: "checked", value: "" },
          { name: "class", value: " class1" },
          { name: "id", value: "id1" },
        ],
      },
      { type: "character", data: "t" },
      { type: "character", data: "e" },
      { type: "character", data: "x" },
      { type: "character", data: "t" },
      { type: "end tag", tagName: "div", attributes: [] },
      { type: "EOF" },
    ]);
  });
  test("one tag has a two attributes, attributes has space", () => {
    testCase('<img checked class = " class1"  id="id1"/>', [
      {
        type: "start tag",
        tagName: "img",
        attributes: [
          { name: "checked", value: "" },
          { name: "class", value: " class1" },
          { name: "id", value: "id1" },
        ],
        isSelfClosingTag: true,
      },
      { type: "EOF" },
    ]);
    testCase("<img/>", [
      {
        type: "start tag",
        tagName: "img",
        attributes: [],
        isSelfClosingTag: true,
      },
      { type: "EOF" },
    ]);
    testCase("<img load/>", [
      {
        type: "start tag",
        tagName: "img",
        attributes: [{ name: "load", value: "" }],
        isSelfClosingTag: true,
      },
      { type: "EOF" },
    ]);
    mustThrow("<img/", "eof-in-tag parse error.");
    testCase('<img /a="1"/>', [
      {
        type: "start tag",
        tagName: "img",
        attributes: [{ name: "a", value: "1" }],
        isSelfClosingTag: true,
      },
      { type: "EOF" },
    ]);
  });
  test("must throw eof-before-tag-name parse error.", () => {
    mustThrow("<div checked>text</div><", "eof-before-tag-name parse error.");
  });
  test("must throw eof-in-tag parse error.", () => {
    mustThrow("<div checked>text</div><div class", "eof-in-tag parse error.");
    mustThrow(
      '<div checked>text</div><div class="class1"',
      "eof-in-tag parse error."
    );
  });
  test("must throw missing-attribute-value parse error.", () => {
    mustThrow("<div class=>text</div>", "missing-attribute-value parse error.");
  });
  test("must throw unexpected-question-mark-instead-of-tag-name parse error.", () => {
    mustThrow(
      "<?div class=>text</div>",
      "unexpected-question-mark-instead-of-tag-name parse error."
    );
  });
  test("must throw unexpected-equals-sign-before-attribute-name parse error.", () => {
    mustThrow(
      "<div =class>text</div>",
      "unexpected-equals-sign-before-attribute-name parse error."
    );
  });
  test("must throw parse error: invalid-first-character-of-tagName", () => {
    mustThrow(
      "<div class>text</[div>",
      "parse error: invalid-first-character-of-tagName"
    );
  });
  test("must throw characterReference not complete", () => {
    mustThrow("&<?div>text</div>", "characterReference not complete");
  });
  test("must throw markupDeclarationOpen not complete", () => {
    mustThrow("<!div>text</div>", "markupDeclarationOpen not complete");
  });
  test("must throw tag not match.", () => {
    mustThrow("<div><span>text</div>", "tag not match");
  });
});
