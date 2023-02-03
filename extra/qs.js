function simpleQs(ary) {
  if (ary.length <= 1) {
    return ary;
  }
  const pivotIndex = Math.round(Math.random() * (ary.length - 1));
  const pivot = ary.splice(pivotIndex, 1)[0];
  const [left, right] = [
    ary.filter((item) => item <= pivot),
    ary.filter((item) => item > pivot),
  ];
  return [...simpleQs(left), pivot, ...simpleQs(right)];
}

function quickSort(ary, start = 0, end = ary.length - 1) {
  if (start >= end) {
    return ary;
  }
  const pivotIndex = Math.round(Math.random() * (end - start) + start);
  const pivot = ary[pivotIndex];
  swap(ary, pivotIndex, end);
  let i = -1,
    j = 0;
  while (j < end) {
    if (ary[j] <= pivot) {
      i++;
      swap(ary, i, j);
    }
    j++;
  }
  i++;
  swap(ary, i, end);
  quickSort(ary, start, i - 1);
  quickSort(ary, i + 1, end);
  return ary;
}
function swap(ary, i, j) {
  let cache = ary[i];
  ary[i] = ary[j];
  ary[j] = cache;
}

function randAry() {
  return new Array(10).fill(0).map(() => (Math.random() * 10) | 0);
}

function isSorted(ary) {
  let cache = ary.slice(1);
  return cache.every((item, index) => item >= ary[index]);
}
