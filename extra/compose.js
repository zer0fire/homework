export default function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  } else {
    const last = funcs[funcs.length - 1];
    const rest = funcs.slice(0, -1);
    return (...args) =>
      rest.reduceRight((composed, f) => f(composed), last(...args));
  }
}
