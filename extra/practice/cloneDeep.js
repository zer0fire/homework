let a = new Map();
let b = { a };

// 首先解决循环引用，代码结构，考虑特殊数据结构，比如包装对象，比如正则、函数、日期等等

const isObject = (target) =>
  (typeof target === "object" || typeof target === "function") &&
  target !== null;

// 判断特殊对象的方法
const getType = (obj) => Object.prototype.toString.call(obj);
// 特殊对象类型
const canTraverse = {
  "[object Map]": true,
  "[object Set]": true,
  "[object Array]": true,
  "[object Object]": true,
  "[object Arguments]": true,
};
const canNotTraverse = {
  "[object String]": true,
  "[object Number]": true,
  "[object Boolean]": true,

  "[object RegExp]": true,
  "[object Date]": true,
  "[object Error]": true,
  "[object Function]": true,
  "[object Symbol]": true,
};

const mapTag = "[object Map]";
const setTag = "[object Set]";

// 处理正则
const handleRegExp = (target) => {
  const { source, flags } = target;
  return new target.constructor(source, flags);
};

new RegExp("", "");
let a = /aaa/g;

// TODO: Error:SyntaxError: Function statements require a function name
const handleFun = (target) => {
  // 处理箭头函数
  if (!target.prototype) return target;
  //
  const body = target.toString();
  return new Function(body);
};

const handleNotTraverse = (target, tag) => {
  const Ctor = target.constructor;
  switch (tag) {
    case boolTag:
    case numberTag:
    case stringTag:
    case errorTag:
    case dateTag:
      return new Ctor(target);
    case regexpTag:
      return handleRegExp(target);
    case funcTag:
      return handleFun(target);
    default:
      return new Ctor(target);
  }
};

// 解决循环引用，解决 Map 带来的内存溢出问题
const deepClone = (target = {}, map = new WeakMap()) => {
  if (!isObject(target)) {
    return target;
  }
  let type = getType(target);
  let cloneTarget;
  if (canTraverse[type]) {
    // 保留原型链的处理
    let ctor = target.constructor;
    cloneTarget = new ctor();
  } else {
    handleNotTraverse(target, type);
  }
  // 有争议，循环引用的 set 类型并不能很好处理，因为其实是相当于表层浅复制了
  if (map.get(target)) {
    return target;
  }
  map.set(target, true);

  if (type === mapTag) {
    target.forEach((item, key) => {
      cloneTarget.set(deepClone(key, map), deepClone(item, map));
    });
  }
  if (type === setTag) {
    // Set 在 forEach 时，如果你对源 Set 添加东西，会造成爆栈
    target.forEach((item) => {
      cloneTarget.add(deepClone(item, map));
    });
  }

  // 处理数组、对象、Arguments
  for (let prop in target) {
    if (target.hasOwnProperty(prop)) {
      cloneTarget[prop] = deepClone(target[prop], map);
    }
  }
  return cloneTarget;
};
