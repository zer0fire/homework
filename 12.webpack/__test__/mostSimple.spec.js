const { simpleNum } = require("../20230909最简分数");

describe("最简分数", () => {
  it("测试", () => {
    expect(simpleNum(20)).toEqual(4);
    // expect(simpleNum(1234567)).toEqual(612360);
  });
});
