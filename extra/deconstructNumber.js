// 有效位数 coefficient
function deconstruct(number) {
    // 数值 = 符号位 * 系数 * （2 ** 指数）
    // 符号位
    let sign = 1
    // 整数系数
    let coefficient = number
    // 指数
    let exponent = 0 
    if (coefficient < 0) {
        coefficient = -coefficient
        sign = -1
    }
    if (Number.isFinite(number) && number !== 0) {
        // -1128 就是 Number.MIN_VALUE 的指数减去有效位数再减去奖励位的结果
        exponent = -1128
        let reduction = coefficient
        while (reduction !== 0) {
            exponent += 1
            reduction /= 2
        }
        reduction = exponent
        while (reduction > 0) {
            coefficient /= 2
            reduction -= 1
        }
        while (reduction < 0) {
            coefficient *= 2
            reduction += 1
        }
    }
    return {
        sign,
        coefficient,
        exponent,
        number
    }
}

console.log(deconstruct(Number.MAX_SAFE_INTEGER))