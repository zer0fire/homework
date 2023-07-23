interface Test {
  fn: {
    (channel: "a"): void;
    (channel: "b"): number;
  };
}

type OverloadProps<TOverload> = Pick<TOverload, keyof TOverload>;

type OverloadUnionRecursive<
  TOverload,
  TPartialOverload = unknown
> = TOverload extends (...args: infer TArgs) => infer TReturn
  ? // prevent infinite recursion by stopping when TPartialOverload
    // has accumulated all of the TOverload signatures
    TPartialOverload extends TOverload
    ? never
    :
        | OverloadUnionRecursive<
            TPartialOverload & TOverload,
            TPartialOverload &
              ((...args: TArgs) => TReturn) &
              OverloadProps<TOverload>
          >
        | ((...args: TArgs) => TReturn)
  : never;

type OverloadUnion<TOverload extends (...args: any[]) => any> = Exclude<
  OverloadUnionRecursive<
    // The "() => never" signature must be hoisted to the "font" of the
    // intersection for two reasons: a) because recursion stop when it is
    // encountered, and b) it seems to prevent the collapse of subsequent
    // "compatible" signature (eg. '() => void' into "(a?: 1) => void"),
    // which gives a direct conversion to a union
    (() => never) & TOverload
  >,
  TOverload extends () => never ? never : () => never
>;

// Inferring a union of parameter tuples of return types is now possible.
type OverloadParameters<T extends (...args: any[]) => any> = Parameters<
  OverloadUnion<T>
>;
type OverloadReturnType<T extends (...args: any[]) => any> = ReturnType<
  OverloadUnion<T>
>;

type c = Parameters<OverloadUnion<Test["fn"]>>[0];
