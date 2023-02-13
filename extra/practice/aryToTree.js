const arr = [
  {
    id: 0,
    name: "部门S",
    parentId: null,
  },
  {
    id: 2,
    name: "部门B",
    parentId: 0,
  },
  {
    id: 3,
    name: "部门C",
    parentId: 1,
  },
  {
    id: 1,
    name: "部门A",
    parentId: 2,
  },
  {
    id: 4,
    name: "部门D",
    parentId: 1,
  },
  {
    id: 5,
    name: "部门E",
    parentId: 2,
  },
  {
    id: 6,
    name: "部门F",
    parentId: 3,
  },
  {
    id: 7,
    name: "部门G",
    parentId: 2,
  },
  {
    id: 8,
    name: "部门H",
    parentId: 4,
  },
];

const input = [
  {
    id: 1,
    val: "学校",
    parentId: null,
  },
  {
    id: 2,
    val: "班级1",
    parentId: 1,
  },
  {
    id: 3,
    val: "班级2",
    parentId: 1,
  },
  {
    id: 4,
    val: "学生1",
    parentId: 2,
  },
  {
    id: 5,
    val: "学生2",
    parentId: 2,
  },
  {
    id: 6,
    val: "学生3",
    parentId: 3,
  },
];

function aryToTree(ary) {
  ary.sort((itemA, itemB) => itemA.id - itemB.id);
  let cacheMap = new Map();
  let rootNode = Object.assign(ary[0]);
  for (let item of ary) {
    cacheMap.set(item.id, item);
    if (cacheMap.has(item.parentId)) {
      const parentNode = cacheMap.get(item.parentId);
      if (parentNode.children) {
        parentNode.children.push(item);
      } else {
        parentNode.children = [item];
      }
    }
  }
  return rootNode;
}
