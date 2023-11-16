// 24 兆位，字符串表示 高精度整数类型
["+", 8650752, 7098594, 31974];

const radix = 16777216;
const radix_squared = radix * radix;
const log2_radix = 24;
const plus = "+";
const minus = "-";
const sign = 0;
const least = -1;

function last(array) {
  return array[array.length - 1];
}
function next_to_last(array) {
  return array[array.length - 2];
}

const zero = Object.freeze([plus]);
const wun = Object.freeze([plus, 1]);
const two = Object.freeze([plus, 2]);
const ten = Object.freeze([plus, 10]);
const negative_wun = Object.freeze([minus, 1]);

function is_big_integer(big) {
  return Array.isArray(big) && (big[sign] === plus || big[sign] == minus);
}

function is_negative(big) {
  return Array.isArray(big) && big[sign] === minus;
}

function is_positive(big) {
  return Array.isArray(big) && big[sign] === plus;
}

function is_zero(big) {
  return Array.isArray(big) && big.length < 2;
}

// mint 函数。会清楚最后是 0 的几位，然后将数组与几个常量逐一对比
// 如果与其中的一个常量匹配，则用该常量取而代之
// 否则就冻结该数组
/**
 *
 * @param {Array} proto_big_integer
 */
function mint(proto_big_integer) {
  // 从入参移除最高兆位多余的 0，查看是否能用常量代替
  while (last(proto_big_integer) === 0) {
    proto_big_integer.length -= 1;
  }
  if (proto_big_integer.length <= 1) {
    return zero;
  }
  if (proto_big_integer[sign] === plus) {
    if (proto_big_integer.length === 2) {
      if (proto_big_integer[least] === 1) {
        return wun;
      }
      if (proto_big_integer[least] === 2) {
        return two;
      }
      if (proto_big_integer[least] === 10) {
      }
    }
  } else if (proto_big_integer.length === 2) {
    if (proto_big_integer[least] === 1) {
      return negative_wun;
    }
  }
  return Object.freeze(proto_big_integer);
}

function neg(big) {}
