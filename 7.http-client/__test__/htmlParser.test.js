const HTMLParser = require("../htmlParser");

function testCase(html, result) {
  const parser = new HTMLParser();
  parser.write(html);
  if (JSON.stringify(parser.stack) !== JSON.stringify(result)) {
    console.log(parser.stack);
  }
  expect(JSON.stringify(parser.stack)).toEqual(JSON.stringify(result));
}

describe("parse html", () => {
  test("tag", () => {
    testCase("<div></div>", [
      { type: "start tag", tagName: "div", attributes: [] },
      { type: "end tag", tagName: "div", attributes: [] },
    ]);
  });
  test("tag2", () => {
    testCase("<div>text</div>", [
      { type: "start tag", tagName: "div", attributes: [] },
      { type: "character", data: "t" },
      { type: "character", data: "e" },
      { type: "character", data: "x" },
      { type: "character", data: "t" },
      { type: "end tag", tagName: "div", attributes: [] },
    ]);
  });
  //   test("tag3", () => {
  //     testCase('<div class="class1">text</div>', [
  //       { type: "start tag", tagName: "div", attributes: [] },
  //       { type: "character", data: "t" },
  //       { type: "character", data: "e" },
  //       { type: "character", data: "x" },
  //       { type: "character", data: "t" },
  //       { type: "end tag", tagName: "div", attributes: [] },
  //     ]);
  //   });
});
