// 缓存和节流功能的远程请求方法

function fetch() {}
function registerFetchApi(options) {
  const { apiName, method, url } = options;
  let cache = "infinity";
  if (options.cache) {
    cache = options.cache;
  }
}

registerFetchApi({
  apiName: "test",
  method: "get", // 支持 get post delete put
  url: "api/test/",
  cache: "infinity", //可选，可设计时间毫秒数或者无限
});

(async () => {
  const dataList = await Promise.all([
    fetch("test", { data: "123" }),
    fetch("test", { data: "123" }),
  ]);
  const oldData = fetch("test", {
    data: "123",
  });
  //   oldData ==== dataList[0]
  const anotherData = await fetch("test", {
    data: "234",
  });
  //   anotherData !== dataList[0]
})();
