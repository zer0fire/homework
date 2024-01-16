function getNonconstantLength(buffer, i) {
  for (var l = 0; l < buffer.length - i; l++) {
    if (
      buffer[i + l] == buffer[i + l + 1] &&
      buffer[i + l + 1] == buffer[i + l + 2]
    )
      return l;
  }
  return buffer.length - i;
}

function getConstantLength(buffer, i) {
  var first = buffer[i];
  for (var l = 1; l < buffer.length - i; l++)
    if (buffer[i + l] != first) return l;

  return buffer.length - i;
}

function encode(buffer) {
  var result = [];

  var i = 0;
  while (i < buffer.length) {
    var ln = getNonconstantLength(buffer, i);
    result.push(ln);

    result = result.concat(buffer.slice(i, i + ln));
    i += ln;

    if (i >= buffer.length) break;

    var lc = getConstantLength(buffer, i);

    result.push(lc);

    if (lc != 0) result.push(buffer[i]);

    i += lc;
  }
  return result;
}

function decode(buffer) {
  var result = [];
  var i = 0;
  while (i < buffer.length) {
    var ln = buffer[i++];
    result = result.concat(buffer.slice(i, i + ln));
    i += ln;

    if (i >= buffer.length) break;

    var lc = buffer[i++];
    if (lc != 0) result = result.concat(new Array(lc).fill(buffer[i++]));
  }
  return result;
}

var t = [1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 1, 2, 3, 4, 5];
console.log(t);
console.log(encode(t));
console.log(decode(encode(t)));
