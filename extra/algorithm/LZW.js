// LZW 算法
// 几个基本概念：
// dict，字典，一般是ASCII表做默认字典
// cW，当前读取到的字符，每次只读入一位
// pW，上一次留存的字符，第一次读取则为空，可能是一位也可能是多位
// str，为pW与cW的字符拼接

// 编码规则：
// 1、一次只读一个字符
// 2、每次读取完cW拼接在pW之后，形成一个新的字符串为str。
// 3、查询dict里是否有这个新字符串str。
// 3.no、如果没有，则将这个str存入dict中，并以一个新的字符作为代指。并将cW的值存入pW中。
// 3.yes、如果有则将这个str存入pW中，等待与下一次的cW拼接成新的字符串
// 4、这样循环直到结束，然后输出全部代指的字符作为编码后的字符。

// 解码规则：
// 1、一次只读取一个字符。
// 2、因为第一次编码的pW为空，所以解码的第一个cW字符肯定是默认dict里存在的字符，我们可以直接解码输出。并且将cW的值存入pW中，以此为解码开端。
// 3、读取第二个cW时，与前一个pW拼接，形成新的字符串为str，判断dict中是否存在，如果不存在则将这个组合存入dict中。再判断将要解码的字符是否存在dict中。
// 3.yes，如果dict中有，就读取出对应字符。
// 3.no，如果dict中没有。这时候我们应该想到编码的过程，遇到字典中存在的str时，我们会暂存住与下一次cW拼接成新串，直到dict中没有再存入。
// 所以遇到未知字符必然是我们将要写入字典的那一位字符，所以字典中肯定已经存了这个字符的一部分字典已存字符+一位cW字符，而且这个字典已存在字符恰是上一次保存的字符串，一位cW字符则是这个字符串的开始字符，这样我们就能还原出这个字符并写入字典中了。
// 4、不断循环这个解码过程，直到结束

function compress(s) {
  var dic = {};
  for (var i = 0; i < 256; i++) {
    var c = String.fromCharCode(i);
    dic[c] = c;
  }
  var prefix = "";
  var suffix = "";
  var idleCode = 256;
  var result = [];
  for (var i = 0; i < s.length; i++) {
    var c = s.charAt(i);
    suffix = prefix + c;
    if (dic.hasOwnProperty(suffix)) {
      prefix = suffix;
    } else {
      dic[suffix] = String.fromCharCode(idleCode);
      idleCode++;
      result.push(dic[prefix]);
      prefix = "" + c;
    }
  }
  if (prefix !== "") {
    result.push(dic[prefix]);
  }
  return result.join("");
}

function uncompress(s) {
  var dic = {};
  for (var i = 0; i < 256; i++) {
    var c = String.fromCharCode(i);
    dic[c] = c;
  }
  var prefix = "";
  var suffix = "";
  var idleCode = 256;
  var result = [];
  for (var i = 0; i < s.length; i++) {
    var c = s.charAt(i);
    if (dic.hasOwnProperty(c)) {
      suffix = dic[c];
    } else if (c.charCodeAt(0) === idleCode) {
      suffix = suffix + suffix.charAt(0);
    } else {
    }
    if (prefix !== "") {
      dic[String.fromCharCode(idleCode)] = prefix + suffix.charAt(0);
      idleCode++;
    }
    result.push(suffix);
    prefix = suffix;
  }
  return result.join("");
}
