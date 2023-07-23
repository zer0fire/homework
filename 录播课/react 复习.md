# 前提

项目足够大

需要独立发包

# 优点

提升开发体验

提高代码复用率

适合统一管理

单包可发布

# react 复习

useEffect
useMemo
useState
useReducer
useCallback
useContext

# redux

redux/toolkit(react-redux, @redux/toolkit)
zustand
valtio
jotai

数据操作尽量保持在 store 或 slice 里面
其他操作尽量在 hooks 的副作用里
有什么数据不够就使用参数传递

# 问题

如何实现生命周期钩子，比如 scripts/preinstall 是怎么实现的

React 的变量如何传递给 CSS
传统的 css 导入
内联 css
className 的方式
css module
Style Component

middleware
useSelector
createSelector
useDispatch

react-router
react-router-dom

createBrowserRouter({
errorPage
element
path
})
Navigator
useNavigate
Link

如何获取 router 参数
loader 异步请求等副作用
useParams
redirect('/') action 中 navigate hooks 中
action 表单提交后的动作

useRequest
ahooks
