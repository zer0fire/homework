function strStr2(haystack: string, needle: string): number {
  const next: number[] = [0, 0];
  let i: number = 1,
    j: number = 0;
  while (i < needle.length) {
    if (needle[i] === needle[j]) {
      i++;
      j++;
      next[i] = j;
    } else if (j === 0) {
      i++;
      next[i] = j;
    } else {
      j = next[j];
    }
  }

  let l: number = 0;
  for (let k: number = 0; k < haystack.length; k++) {
    if (haystack[k] === needle[l]) {
      l++;
      if (l === needle.length) {
        return k - l + 1;
      }
    } else if (l !== 0) {
      l = next[l];
      k--;
    }
  }
  return -1;
}
