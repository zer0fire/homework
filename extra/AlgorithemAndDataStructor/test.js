const data = [
  {
    id: 1,
    label: "一级 1",
    children: [
      {
        id: 4,
        label: "二级 1-1",
        children: [
          {
            id: 10,
            label: "三级 1-1-2",
            children: [
              {
                id: 11,
                label: "四级 1-1-2-1",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "一级 2",
    children: [
      {
        id: 5,
        label: "二级 2-1",
      },
      {
        id: 6,
        label: "二级 2-2",
      },
    ],
  },
];
//  要求写一个函数，在这个 data 结构中，找到 id 最大的那一项，如上返回： { id: 11, label: '四级 1-1-2-1' }
