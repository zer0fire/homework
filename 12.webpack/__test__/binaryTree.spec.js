const { binaryTree } = require("../20230909深度优先搜索");

describe("二叉树", () => {
  it("广度 + 深度", () => {
    expect(binaryTree(10, 6)).toEqual(5);
    expect(binaryTree(11, 8)).toEqual(11);
    // expect(binaryTree(11, 2500)).toEqual(897);
  });
});
