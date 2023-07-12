return: 父节点
child: 子节点，单链表
sibling: 兄弟节点

flags: Flags 二进制操作

nextEffect: Fiber
lastEffect
deletions: 删除的多个子内容 Array<Fiber> | null

current 同步完的 Fiber
workInProgress 构建出的新的 Fiber
fiber

FiberRootNode 根 Fiber 节点构造函数

isReactComponent 判定是否是类组件还是函数组件

createFiberRoot 创建根 Fiber 节点
创建一个入口

createRoot 调用了 createFiberRoot
构建了 ReactDOMRoot

render 中调用 updateContainer(children, this.\_internalRoot)

1. 处理当前的 fiber，就是 workInProgress
2. 重新复制一份 workInProgress
   performUnitOfWork
   找未处理的其他节点
   completeUnitOfWork
   有子节点
   workInProgress

## hooks 主要做了什么？

把状态放在 fiber 上，某种意义上是访问 Fiber 的 API
(这句话很关键，因为 hooks 本身是一种访问型 API 而不是自己实现的方法或者状态，因此需要访问的时候就必须严格按照顺序，之所以不让用包裹型的语法也是如此，但其实只要保证状态顺序严格一致，其实是可以用的)

## hooks 解决了什么问题

1. 高阶组件嵌套（自定义 Hooks）
2. 复杂组件变得难以理解。运行时机耦合，effect hooks 可以多个，但是 componentDidMount 只能有一个
3. class 的 this 工作方式，必须 bind 或者箭头函数，hook 可以使用出更多功能
