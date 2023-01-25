//  leetco
//  leetco
//       ^
//  001000



/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
 var strStr = function(haystack, needle) {
    // sadbutsad
    // sad
    let n = [0, 0]
    let i = 1, j = 0;
    while(i < needle.length) {
        if (needle[i] === needle[j]) {
             j++
             i++
             n[i] = j
        } else if (j === 0) {
            i++
            n[i] = 0
        } else {
            j = n[j]
        }
    }
    let l = 0;
    for(let k = 0; k < haystack.length; k++) {
        if (haystack[k] === needle[l]) {
            l++
            if (l === needle.length) {
                return k - l + 1
            }
        } else if (l !== 0) {
                l = n[l]
                k--
            }
    }
    return -1
};