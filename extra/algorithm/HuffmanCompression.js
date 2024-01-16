// function buildFrequencyTable(string) {
//   let frequencyTable = {};
//   for (let char of string) {
//     frequencyTable[char] = frequencyTable[char] + 1 || 1;
//   }
//   return frequencyTable;
// }

// class Node {
//   constructor(char, frequency) {
//     this.char = char;
//     this.frequency = frequency;
//     this.left = null;
//     this.right = null;
//   }
// }

// function buildHuffmanTree(frequencyTable) {
//   let nodes = [];
//   for (let char in frequencyTable) {
//     nodes.push(new Node(char, frequencyTable[char]));
//   }

//   while (nodes.length > 1) {
//     nodes.sort((a, b) => a.frequency - b.frequency);
//     let left = nodes.shift();
//     let right = nodes.shift();
//     let parent = new Node(null, left.frequency + right.frequency);
//     parent.left = left;
//     parent.right = right;
//     nodes.push(parent);
//   }
//   return nodes[0];
// }

// function encode(root, string, encoding = "") {
//   if (!root) return;
//   if (!root.left && !root.right) {
//     console.log(`${root.char}: ${encoding}`);
//     return;
//   }
//   encode(root.left, string, encoding + "0");
//   encode(root.right, string, encoding + "1");
// }

// function decode(root, encoded) {
//   let current = root;
//   let decoded = "";
//   for (let bit of encoded) {
//     if (bit === "0") {
//       current = current.left;
//     } else {
//       current = current.right;
//     }
//     if (!current.left && !current.right) {
//       decoded += current.char;
//       current = root;
//     }
//   }
//   return decoded;
// }

/**
 *
 赫夫曼编码
基本介绍

1.赫夫曼编码也翻译为    哈夫曼编码(Huffman Coding)，又称霍夫曼编码，是一种编码方式, 属于一种程序算法
赫夫曼编码是赫哈夫曼树在电讯通信中的经典的应用之一。

2.赫夫曼编码广泛地用于数据文件压缩。其压缩率通常在20%～90%之间
赫夫曼码是可变字长编码(VLC)的一种。Huffman于1952年提出一种编码方法，称之为最佳编码

 *
 *
 */

class Node {
  data; //存放数据(字符本身),比如 'a' => 97, ' '=>32
  weight; //权值，表示字符串出现的次数
  left; //
  constructor(data, weight) {
    this.data = data;
    this.weight = weight;
  }

  //前序遍历
  preOrder(arr) {
    arr.push(this);
    if (this.left) {
      this.left.preOrder(arr);
    }
    if (this.right) {
      this.right.preOrder(arr);
    }
  }
}

/**
 *
 * @param {接受字符数组} bytes
 * @return 返回的就是list形式
 */
function getNodes(bytes) {
  //创建一个list
  let list = [];
  //counts 统计每一个byte出现的次数
  let counts = {};
  for (let b of bytes) {
    let count = counts[b]; //map还没有这个字符数据
    if (count == null) {
      counts[b] = 1;
    } else {
      counts[b]++;
    }
  }

  for (const [key, value] of Object.entries(counts)) {
    list.push(new Node(key, value));
  }
  return list;
}

//通过list创建赫夫曼树
function createHuffmanTree(nodes) {
  const compareFun = function (a, b) {
    return a.weight - b.weight;
  };
  while (nodes.length > 1) {
    //排序,从小到大
    nodes.sort(compareFun);
    //取出第一颗最小的二叉树
    let leftNode = nodes.shift(),
      rightNode = nodes.shift();
    //创建一个新的二叉树，它的根节点，没有data，只有权值
    let parent = new Node(null, leftNode.weight + rightNode.weight);
    parent.left = leftNode;
    parent.right = rightNode;

    //将新的二叉树，加入到nodes
    nodes.unshift(parent);
  }
  //nodes最后的节点，就是根节点
  return nodes.shift();
}

//生成赫夫曼树对应的赫夫曼编码表
function getCodes2(root) {
  if (root == null) {
    return null;
  }
  //生成赫夫曼树对应的赫夫曼编码表
  //思路
  //1.将赫夫曼编码表存放在map里面
  //2.在生成赫夫曼编码表时，需要拼接路径，定义一个数组string,存储某个叶子节点的路径

  let huffmanCodes = {};
  let string = [];
  /**
   * 将传入的node节点的所有叶子节点的赫夫曼编码得到，并放入到huffmanCodes集合中
   * @param {传入节点} node
   * @param {路径：左子节点是0，右子节点是1} code
   * @param {用于拼接路径} string
   */
  function getCodes(node, code, string) {
    let string2 = [...string];
    //将code加入到string中
    string2.push(code);
    if (node != null) {
      //如果node == null不处理
      //判断当前node是叶子节点还是非叶子节点
      if (node.data == null) {
        //非叶子节点
        //递归处理
        //向左递归
        getCodes(node.left, "0", string2);
        //向右递归
        getCodes(node.right, "1", string2);
      } else {
        //说明是一个叶子节点
        //就表示找到了某个叶子节点的最后
        huffmanCodes[node.data] = string2.join("");
      }
    }
  }
  getCodes(root, "", string);
  return huffmanCodes;
}

//编写一个方法，将字符串对应的bytes数组，通过生成的赫夫曼编码表，返回一个赫夫曼编码压缩后的byte数组
/**
 *
 * @param {原始的字符串对应的bytes数组} bytes
 * @param {生成的赫夫曼编码表} huffmanCodes
 * @return 返回的是字符串对应的一个byte数组
 */
function zip(bytes, huffmanCodes) {
  //1.利用huffmanCodes将bytes转成赫夫曼编码对应的字符串
  let string = [];
  //遍历数组
  for (let b of bytes) {
    string.push(huffmanCodes[b]);
  }
  return string;
}

function huffstringToByte(string) {
  //计算赫夫曼编码字符串的长度
  string = string.join("");
  let len = Math.ceil(string.length / 8);
  //创建存储压缩后的byte数组
  let huffmanCodeByte = new Array(len + 1);
  let index = 0,
    strByte; //记录是第几个byte
  for (let i = 0; i < string.length; i += 8) {
    strByte = string.substring(i, i + 8);
    //将strByte转成一个byte，放入huffmanCodeByte
    huffmanCodeByte[index] = parseInt(strByte, 2);
    index++;
  }
  //记录最后一位二进制码的长度，因为，比如最后一位二进制strByte为00101时，
  //parseInt(strByte, 2)后等于5，前面的两个00已经丢失，所以必须记录长度，以便解码时补足前面的0
  huffmanCodeByte[index] = strByte.length;
  return huffmanCodeByte;
}

//使用一个方法，封装前面的方法，便于调用
/**
 *
 * @param {原始的字符串对应的字节数组} bytes
 * @returns 是经过赫夫曼编码处理后，压缩后的字节数组
 *
 */
function huffmanZip(bytes) {
  //1.生成节点数组
  let nodes = getNodes(bytes);
  //2.根据节点数组创建赫夫曼树
  let root = createHuffmanTree(nodes);
  //3.根据赫夫曼树生成赫夫曼编码
  let hufumanCodes = getCodes2(root);
  //4.根据生成的赫夫曼编码生成压缩后的赫夫曼编码字节数组
  let hufumanStrArr = zip(bytes, hufumanCodes);
  let hufumanByteArr = huffstringToByte(hufumanStrArr);

  return hufumanByteArr;
}

//完成数据的解压
//思路
//1.将huffmanBytesArr先转成赫夫曼编码对应的二进制字符串
//2.将赫夫曼编码对应的二进制的字符串转成赫夫曼编码字符串

/**
 *
 * @param {表示是否需要补高位，如果是true，表示需要，如果是false，表示不需要，如果是最后一个字节不需要补高位} flag
 * @param {传入的byte} byte
 * @returns 是byte对应的二进制字符串
 */
function heffmanByteToString(flag, byte) {
  //如果是
  if (flag) {
    byte |= 256;
  }
  let str = Number(byte).toString(2);
  if (flag) {
    return str.substring(str.length - 8);
  } else {
    return str;
  }
}

//编写一份方法，完成对压缩数据的解码
/**
 *
 * @param {赫夫曼编码表} huffmanCodes
 * @param {赫夫曼编码得到的二进制数组} huffmanBytes
 */
function decode(huffmanCodes, huffmanBytes) {
  //1.先得到二进制字符串 形式11001111111011......
  let heffmanStrArr = [];
  for (let i = 0; i < huffmanBytes.length - 1; i++) {
    //判断是不是最后一个字节
    let flag = i !== huffmanBytes.length - 2;
    heffmanStrArr.push(heffmanByteToString(flag, huffmanBytes[i]));
  }
  //最后一位记录的是最后一位二进制字符串的长度，该长度主要用于补足最后一位丢失的0,所以要单独处理，
  let lastByteStr = heffmanStrArr[heffmanStrArr.length - 1];
  let lastByteLength = huffmanBytes[huffmanBytes.length - 1];
  lastByteStr =
    "00000000".substring(8 - (lastByteLength - lastByteStr.length)) +
    lastByteStr;
  heffmanStrArr[heffmanStrArr.length - 1] = lastByteStr;

  //把赫夫曼编码表进行调换
  let map = {};
  for (const [key, value] of Object.entries(huffmanCodes)) {
    map[value] = key;
  }

  let heffmanStr = heffmanStrArr.join("");
  let list = [];
  //
  for (let i = 0; i < heffmanStr.length; ) {
    let count = 1;
    let flag = true;
    let b = null;
    while (flag) {
      //取出一个1或0
      //i不动，count移动，直到匹配到一个字符
      let key = heffmanStr.substring(i, i + count);
      b = map[key];
      if (!b) {
        //没有匹配到
        count++;
      } else {
        //匹配到
        flag = false;
      }
    }
    list.push(parseInt(b));
    i += count;
  }
  //当for循环结束后，list中就存放了所有的字符

  return list;
}

let content = `[Event "?"]
[Site "?"]
[Date "2021.11.??"]
[Round "?"]
[White "2.26-2"]
[Black "?"]
[Result "*"]
[ECO "C45"]
[Annotator "Miss-Regina"]
[PlyCount "19"]
[SourceVersionDate "2017.09.30"]

1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Bc5 5. Nb3 (5. Be3 Qf6 (5... Nf6 6. Nxc6
) 6. c3 Nge7 7. Be2 O-O 8. O-O d5 9. Nxc6 Qxc6 10. Bxc5 Qxc5) 5... Bb6 6. a4 (
6. Nc3 Qf6 (6... d6 7. a4 (7. Nd5) 7... a5 (7... a6 8. Nd5 Ba7 9. Bg5 Qxg5 10.
Nxc7+ Ke7 (10... Kd8) (10... Kd7 11. Nxa8 Nf6 (11... b6 12. g3 (12. a5) 12...
Bb7 13. Bh3+ Kd8 (13... Ke7 14. Nc7) 14. Qxd6+) 12. Qd2 Qxd2+ 13. Nxd2 b6 14.
Nc4) 11. Nxa8) 8. Nd5 Nf6 9. Bg5 (9. Nxb6 cxb6) 9... Bxf2+) 7. Qe2 Nge7 8. Nd5
Nxd5 9. exd5+ Ne7 10. a4) 6... a6 (6... a5) 7. Bd3 d6 8. O-O Nf6 9. Nc3 O-O 10.
Bg5 *`;
let bytes = stringToByte(content);
let nodes = getNodes(bytes);
let root = createHuffmanTree(nodes);
console.log("根节点：", root);
let list = [];
root.preOrder(list);
console.log("前序遍历：", list);

//测试
let hufumanCodes = getCodes2(root);
console.log("生成的赫夫曼编码表：", hufumanCodes);

//生成赫夫曼编码字符串
let hufumanStrArr = zip(bytes, hufumanCodes);
console.log("赫夫曼编码字符串：", hufumanStrArr.join(""));
console.log("赫夫曼编码字符串的长度：", hufumanStrArr.join("").length); //应该是133

//将生成赫夫曼编码字符串转成字节数组, 要发送的数组
let hufumanByteArr = huffstringToByte(hufumanStrArr); //长度为17
console.log("压缩后的字节数组", hufumanByteArr);
console.log(
  "压缩率：",
  ((bytes.length - hufumanByteArr.length) / bytes.length) * 100 + "%"
);

//测试封装后的方法
console.log("压缩后的字节数组", huffmanZip(bytes));

//测试解码
console.log("解码后的的：", decode(hufumanCodes, hufumanByteArr));
console.log("原字符数组：", bytes);
console.log("解码后字符串：", byteToString(bytes));
console.log("原先的字符串：", byteToString(bytes));

//js byte[] 和string 相互转换 UTF-8
function stringToByte(str) {
  var bytes = new Array();
  var len, c;
  len = str.length;
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }
  return bytes;
}

function byteToString(arr) {
  if (typeof arr === "string") {
    return arr;
  }
  var str = "",
    _arr = arr;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}
