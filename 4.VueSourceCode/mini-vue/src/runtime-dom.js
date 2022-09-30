import { createRenderer } from './renderer'

// nodeOptions
// 插入
function insert(parent, child) {
    return parent.appendChild(child)
}
// 查询
function querySelector(str) {
    return document.querySelector(str)
}
// 删除
function remove(child) {
    const parent = child.parentNode
    if (parent) {
        parent.removeChild(child)
    }
}
// 新增
function createElement(tag) {
    return document.createElement(tag)
}
function createText(text) {
    return document.createTextNode(text)
}
function createComment(text) {
    return document.createComment(text)
}
// 复制
function cloneNode(el) {
    const cloned = el.cloneNode(true)
    return cloned
}
// propOption
function patchProps (el, key, prevValue, nextValue) {

}


const nodeOptions = {
    insert,
    querySelector,
    remove,
    createElement,
    createText,
    createComment,
    cloneNode,
    patchProps
}



export function createApp(options) {
    const renderer = createRenderer(nodeOptions)
    return renderer.createApp(options)
}