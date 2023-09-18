// 广度优先遍历制成树
// 深度优先遍历遍历到对应的节点
// 返回 val

function createTree(count) {
  let newArr = [{}];
  //   subNodes = [5,6,7,8]
  //   [1,2,3,5,6,7,8,9,10] //
  for (let i = 0; i < count; i++) {
    let node = newArr[i];
    if (!node.val) {
      node.val = i + 1;
    }
    if (!node.left && newArr.length < count) {
      node.left = {};
      newArr.push(node.left);
    }
    if (!node.right && newArr.length < count) {
      node.right = {};
      newArr.push(node.right);
    }
    // left
    // right
    //
  }
  return newArr[0];
}
// debugger;
// createTree(count);

// TODO: 作业，平凡二叉树

function binaryTree(num, count) {
  // 构建广度二叉树
  // 深度优先遍历
  //   根据深度下标，取到对应值
  // [1,2,3]
  //   0 1 2
  // left index * 2 + 1
  // right index * 2 + 2
  //           1
  //      2       3
  //   4    5     6     7
  //  8 9 10 11 12 13 14

  //          1
  //     2         9
  //   3   6     10    13
  //  4 5 7 8  11 12 14

  const tree = createTree(num);
  let res = 0;
  function traverse(root, fn) {
    if (!root) return;
    let left = root.left;
    let right = root.right;
    fn && fn(root);
    count--;
    if (!count) {
      res = root.val;
    }
    traverse(left);
    traverse(right);
  }
  traverse(tree);
  return res;
}

module.exports = {
  binaryTree,
};
