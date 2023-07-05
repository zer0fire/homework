// 定义一个类型，将一个函数的所有参数都变为可选的
type PartialParameters<FN extends (...args: any[]) => any> = Partial<
  Parameters<FN>
>;

// 定义一个类型，将一个函数的前N个参数去掉，返回剩余参数的类型
type DropParameters<
  FN extends (...args: any[]) => any,
  N extends number
> = N extends 0
  ? FN
  : FN extends (arg: any, ...rest: infer P) => infer R
  ? DropParameters<(...args: P) => R, N>
  : never;

type AnyFunction = (...args: any[]) => any;

// 定义一个类型，表示柯里化后的函数
type CurriedFunction<FN extends AnyFunction> = <
  T extends PartialParameters<FN>
>(
  ...args: T[]
) => // 如果传入的参数个数大于等于原函数的参数个数，则返回原函数的返回值类型
T extends { length: AnyFunction["length"] }
  ? ReturnType<FN>
  : // 否则返回一个新的柯里化函数，参数为原函数剩余的参数
    CurriedFunction<DropParameters<FN, T["length"]>>;

// 定义一个柯里化函数
function curry<FN extends (...args: any[]) => any>(
  fn: FN
): CurriedFunction<FN> {
  return (...args) => {
    // 如果传入的参数个数大于等于原函数的参数个数，则直接调用原函数并返回结果
    if (args.length >= fn.length) {
      return fn(...args);
    }
    // 否则返回一个新的柯里化函数，绑定已传入的参数
    return curry(fn.bind(null, ...args));
  };
}
