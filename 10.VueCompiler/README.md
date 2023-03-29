# mini-vue

- 隐藏细节

- 数据驱动

- 数据响应式

- 模板语法和编译器

- 虚拟 DOM 到 真实 DOM

- 组件化

- Diff 算法

- 数据性

  - react：setState -》useState 主动

  - vue：响应式 被动

    - vue2 Object.defineProperty 数组覆盖原型方法 增删属性额外 API，Vue.set / delete

      - defineProperty 是主动绑定，导致占用内存多，初始化 key 的时候需要遍历，初始化性能下降

    - -> vue3 Proxy 支持对象

      - Proxy 的效率高，性能好，是因为是懒处理

    - Vue2.7 响应式 API，内部还是 Vue2，性能上没改进，只是上了新语法

`rollup src/reactivity/index.js -f iife -n Reactivity -o build/reactivity.js`

# 为什么需要虚拟 DOM

0. vue1.x 没有虚拟 DOM，template 编译成指令，导致内存会爆炸
1. 为了不全量更新，只增量更新
2. 为了 diff 算法
3. DOM 太重，数据太多
