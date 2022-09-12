# 设计思路

* 易用、灵活、高效、跨平台

    比如 add / remove

* 声明式编程 declarative
  * 与命令式的区别
* 复用性
  * 比如指令 directive
* 可扩展
* 跨平台
  * renderer：通用代码写好，假设用户实现了增删改查，通用代码调用用户代码
* 模板和编译

# 模块结构

vue 

* Runtime-dom
  * Runtime-core
* Reactivity
* Compiler-dom
  * Compiler-core
* Renderer
