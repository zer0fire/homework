(async () => {
  const module = await import("./add.mjs");
  console.log(module.default);
})();
