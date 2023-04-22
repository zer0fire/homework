#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int strStr(char * haystack, char * needle){
    int haystackLen = strlen(haystack);
    int needleLen = strlen(needle);
    if (needleLen == 0) {
        return -1;
    }
    printf("%d\n", haystackLen);
    printf("%d\n", needleLen);
    int i = 1;
    int j = 0;
    int *next[100];
    while(i < needleLen) {
        if (needle[i] == needle[j]) {
            i++;
            j++;
            next[i] = j;
        } else if (j == 0) {
            i++;
            next[i] = j;
        } else {
            j = next[j];
        }
    }
    int l = 0;
    for(int k = 0; k < haystackLen; k++) {
        if (haystack[k] == needle[l]) {
            l++;
            if (l == needleLen) {
                return k - l + 1;
            }
        } else if (l != 0) {
            k--;
            l = next[l];
        }
    }
    return -1;
}

void main() {
    printf('res %d\n', strStr("mississippi", "issip"));
}