export function generate(ast) {
  /*
  const ast = [
      {
        type: "Element",
        tag: "div",
        props: [
          {
            type: "Attribute",
            name: "id",
            value: "some",
          },
        ],
        isUnary: false,
        children: [{ type: "Text", content: "foo" }],
      },
    ];
  */
  const { tag, props, children } = ast[0];

  let propObj = null;
  // 'id':'some' 'class':'foo'
  // JSON.stringify
  //
  // {}

  if (props.length) {
    // {
    //   type: "Attribute",
    //   name: "id", v-for v-show
    //   value: 'some' true false foo+bar,
    // html 属性 attributes 自定义属性 props 事件 events
    // Vue3
    // 事件 on 开头
    // @click => onClick
    // 其他都是属性
    // },
    propObj = `{${props.map((v) => `'${v.name}':'${v.value}'`).join(",")}}`;
  }
  //   for (let i = 0; i < children.length; i++) {

  //   }

  let childStr = "";
  if (children.length === 1) {
    if (children[0].type === "Text") {
      childStr += `'${children[0].content}'`;
      //   `'foo'`
    }
  }

  return `return this._c('${tag}',${propObj},${childStr})`;
}
