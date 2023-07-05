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
