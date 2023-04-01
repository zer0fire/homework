// type optionalObj = { name?: string };
// type emptyObj = {};

// let optionalObj: optionalObj = { name: "11" };
// let emptyObj: emptyObj = {};

// optionalObj = emptyObj;
// emptyObj = optionalObj;

// declare let a: { a: 1; b?: number };
// declare let b: { a: 1 };
// declare let c: { a: 1; b?: string };

// TS舍弃安全性，带来便利，实际上和空对象无关，是TS不密封

// a = b;
// b = a;

// b = c;
// c = b;
// a = c;
// c = a;

type optionalObj = { name?: string };
let emptyObj: {} = {};

let arr: {}[] = [1, true];
let data: optionalObj[] = [emptyObj, 1];

data = arr;
