const KVList = [
  {
    key: "a" as const,
    value: "aaa" as const,
  },
];

type KVList = typeof KVList;
type KV = KVList[number];

const KV = {
  key: "aa",
  value: "bb",
};

type KVKey = keyof KV;
type KVValue = KV[KVKey];
