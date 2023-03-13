// ts 类型声明，属性 a 传了就必须传属性 b
// 传递 a 为 true，b 可以传入也可以不传入
// 传递 a 为 false，b 不可以传入
// type MyType<T extends boolean> = {
//   a: T;
//   b?: T extends true ? string : never;
// };

// const myObj1: MyType<true> = { a: true };
// const myObj2: MyType<false> = { a: false };
// const myObj3: MyType<true> = { a: true, b: "hello" };
// const myObj4: MyType<false> = { a: false, b: "world" };

// 定义一个接口，有两个属性a和b
interface MyInterface {
  a?: string;
  b?: number;
}

// 定义一个条件类型，如果T中有a属性，那么就返回T & {b: number}，否则就返回T
type MyConditionalType<T> = T extends { a: string } ? T & { b: number } : T;

// 测试一下
let x: MyConditionalType<MyInterface> = {}; // OK
let y: MyConditionalType<MyInterface> = { a: "string" }; // Error, 缺少属性b
let z: MyConditionalType<MyInterface> = { a: "world", b: 42 }; // OK
