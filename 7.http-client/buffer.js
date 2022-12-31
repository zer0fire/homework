const buf = Buffer.from([1, 2, 3]);
console.log(buf);

// ascii 范围内，utf8 占内存少，utf16 反而和多一个字符位
// 中文及以外，utf16 占内存少，uft8 多出来
// utf16 平时占的位都是两个，emoji 可能多很多
// 单码点、多码点，多个码组成的 emoji 等等
// utf16le 适用用 buffer 长度为字符串二倍的论断，前提是不能有 emoji 这些
const buf1 = Buffer.from("一", "utf16le");
console.log(buf1);

// 直接操作内存 TypedArray
// Uint16Array
// Uint32Array
// Uint8Array
// Float32Array
// Float64Array
