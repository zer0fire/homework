list.reduce((acc, item) => Object.assign(acc, { [item.key]: item }), {});
list.reduce((acc, item) => ({}), {});
lodash.minBy;
lodash.keyBy;
// JSON Placeholer

// 给一堆 id，写死 1 到 10，放在一个下拉框里面。
// 然后根据页面选择，从 JSON PlaceHolder里请求 User 数据，并显示在页面上，
// 不需要考虑好看不好看
