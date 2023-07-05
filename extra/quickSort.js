// 为什么不稳定，如何解决
// 随机 pIdx 的好处？为什么不用固定的？
// qs 为什么会？
// 说说 qs 的基本原理，为什么要分治解决
// 分治在 qs 中的应用

// function swap(ary, i, j) {
//     let ca = ary[i]
//     ary[i] = ary[j]
//     ary[j] = ca
// }
/**
 *
 * @param {Array} ary
 * @param {Number} start
 * @param {Number} end
 */
function qs(ary, start = 0, end = ary.length - 1) {
  if (end <= start) {
    return ary;
  }
  const range = Math.floor(Math.random() * (end - start));
  const pIdx = start + range;
  const pivot = ary[pIdx];
  swap(ary, end, pIdx);
  let i = -1,
    j = 0;
  while (j <= end - 1) {
    if (ary[j] <= pivot) {
      i++;
      swap(ary, i, j);
    }
    j++;
  }
  i++;
  swap(ary, end, i);
  qs(ary, start, i - 1);
  qs(ary, i + 1, end);
  return ary;
}

function genArray(n) {
  return new Array(n).fill(0).map(() => (Math.random() * 10) | 0);
}

function isSorted(ary) {
  return ary.slice(1).every((it, index) => {
    return ary[index] <= it;
  });
}

function qs(ary, start = 0, end = ary.length - 1) {
  if (start >= end) {
    return ary;
  }
  const pivotIndex = ((Math.random() * (end - start)) | 0) + start;
  const pivot = ary[pivotIndex];
  console.log(pivot, pivotIndex, ary);
  [ary[pivotIndex], ary[end]] = [ary[end], ary[pivotIndex]];
  let i = -1,
    j = 0;
  while (j < end) {
    if (ary[j] <= pivot) {
      i++;
      [ary[j], ary[i]] = [ary[i], ary[j]];
    }
    j++;
  }
  i++;
  [ary[i], ary[end]] = [ary[end], ary[i]];
  qs(ary, start, i - 1);
  qs(ary, i + 1, end);

  return ary;
}

function quickSort(ary, start = 0, end = ary.length - 1) {
  if (start >= end) return ary;
  const pivotIndex = ((Math.random() * (end - start)) | 0) + start;
  const pivot = ary[pivotIndex];
  let left = ary.filter((item) => item <= pivot);
  let right = ary.sort((item) => item > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}
