// import { createRenderer } from "../runtime-core";
// import { nodeOpts } from "./nodeOpts";

import { createRenderer } from "../runtime-core";

// // createRenderer()

// export default {
//   createRenderer: createRenderer.bind(null, nodeOpts),
//   nodeOpts,
// };
// export Create as createRenderer
export * from "./nodeOpts";
export function createApp(rootOption) {
  const renderer = createRenderer();
  const app = renderer.createApp(rootOption);
  const mount = app.mount;
  app.mount = function (container) {
    if (typeof container === "string") {
      container = document.querySelector(container);
    }
    mount(container);
  };
  return app;
}
