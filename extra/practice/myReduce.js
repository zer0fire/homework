Array.prototype.myReduce = function (callback, item) {
  const ary = this;
  const result = item;

  if (!result) {
    result = ary[0];
    for (let i = 1; i < ary.length - 1; i++) {
      result = callback(result, ary[i], i, ary);
    }
  } else {
    for (let i = 0; i < ary.length - 1; i++) {
      result = callback(result, ary[i], i, ary);
    }
  }

  return result;
};
