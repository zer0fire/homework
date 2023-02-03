const Heap = [];
// 1,2,3,4,5
// 5,4,3,2,1

// [4, 5, 8, 2, 3]
// 0 1 2 3 4

// 0 1 2
// 1 3 4

//     2
//   3,  8
//  5  4

//         5
//      5,    4,
//    2, 4,  1, 0
//  3, 4,

// 0
// 1,2
// 3,4,5,6
//

// left childIndex =  parentIndex * 2 + 1
// right childIndex = parentIndex * 2 + 2

function swap(ary, i, j) {
  let ca = ary[i];
  ary[i] = ary[j];
  ary[j] = ca;
}

/**
 *
 * @param heap
 * @param node
 */
function push(heap, node) {
  heap.push(node);
  let curIndex = heap.length - 1;
  while (curIndex) {
    let curNode = heap[curIndex];
    let parentIndex;
    if (curIndex % 2 === 0) {
      parentIndex = (curIndex - 2) / 2;
    } else {
      parentIndex = (curIndex - 1) / 2;
    }
    let parentNode = heap[parentIndex];
    if (!parentNode) {
      return;
    }
    if (curNode.value < parentNode.value) {
      swap(heap, curIndex, parentIndex);
      curIndex = parentIndex;
    } else {
      return;
    }
  }
}

function peek(heap) {
  return heap[0];
}

function pop(heap) {
  let result = heap[0];
  heap.shift();
  heap.unshift(heap.pop());
  let curIndex = 0;
  while (curIndex <= heap.length - 1) {
    let curNode = heap[curIndex];
    let leftChildNode = heap[curIndex * 2 + 1];
    let rightChildNode = heap[curIndex * 2 + 2];
    if (leftChildNode !== undefined) {
      // 交换左
      if (
        curNode.value > leftChildNode.value &&
        (rightChildNode.value === undefined ||
          rightChildNode.value >= leftChildNode)
      ) {
        swap(heap, curIndex, curIndex * 2 + 1);
        curIndex = curIndex * 2 + 1;
        // 交换右
      } else if (
        curNode.value > rightChildNode.value &&
        rightChildNode.value < leftChildNode.value
      ) {
        swap(heap, curIndex, curIndex * 2 + 2);
        curIndex = curIndex * 2 + 2;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return result;
}

/**
 * @param {number} k
 * @param {number[]} nums
 */
var KthLargest = function (k, nums) {
  this.k = k;
  for (let i = 0; i < nums.length; i++) {
    push(Heap, { value: nums[i] });
  }
};

/**
 * @param {number} val
 * @return {number}
 */
KthLargest.prototype.add = function (val) {
  push(Heap, { value: val });
  for (let i = 0; i < this.k - 1; i++) {
    pop(Heap);
  }
  return peek(Heap);
};

/**
 * Your KthLargest object will be instantiated and called as such:
 * var obj = new KthLargest(k, nums)
 * var param_1 = obj.add(val)
 */

// let a = new KthLargest(3, [4, 5, 8, 2])
// console.log(a.add(3))
// console.log(Heap)

/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number[]}
 */
var getLeastNumbers = function (arr, k) {
  const Heap = [];
  function swap(ary, i, j) {
    let ca = ary[i];
    ary[i] = ary[j];
    ary[j] = ca;
  }

  /**
   *
   * @param heap
   * @param node
   */
  function push(heap, node) {
    heap.push(node);
    let curIndex = heap.length - 1;
    while (curIndex) {
      let curNode = heap[curIndex];
      let parentIndex;
      if (curIndex % 2 === 0) {
        parentIndex = (curIndex - 2) / 2;
      } else {
        parentIndex = (curIndex - 1) / 2;
      }
      let parentNode = heap[parentIndex];
      if (!parentNode) {
        return;
      }
      if (curNode < parentNode) {
        swap(heap, curIndex, parentIndex);
        curIndex = parentIndex;
      } else {
        return;
      }
    }
  }

  function peek(heap) {
    return heap[0];
  }

  function pop(heap) {
    let result = heap[0];
    heap.shift();
    heap.unshift(heap.pop());

    let curIndex = 0;
    while (curIndex <= heap.length - 1) {
      let curNode = heap[curIndex];
      let leftChildNode = heap[curIndex * 2 + 1];
      let rightChildNode = heap[curIndex * 2 + 2];
      if (leftChildNode !== undefined) {
        // 交换左
        if (
          curNode > leftChildNode &&
          (rightChildNode === undefined || rightChildNode >= leftChildNode)
        ) {
          swap(heap, curIndex, curIndex * 2 + 1);
          curIndex = curIndex * 2 + 1;
          // 交换右
        } else if (curNode > rightChildNode && rightChildNode < leftChildNode) {
          swap(heap, curIndex, curIndex * 2 + 2);
          curIndex = curIndex * 2 + 2;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return result;
  }
  for (let i = 0; i < arr.length; i++) {
    push(Heap, arr[i]);
  }
  const result: number[] = [];
  for (let i = 0; i < k; i++) {
    result.push(pop(Heap));
  }
  console.log(result);
  return result;
};

getLeastNumbers([0, 0, 1, 2, 4, 2, 2, 3, 1, 4], 8);

//          0
//        0, 1
//     1, 4, 2, 2,
//   3, 2, 4
