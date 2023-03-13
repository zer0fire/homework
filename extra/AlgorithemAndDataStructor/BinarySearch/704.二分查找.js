// 给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target
// 写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */

function search(nums, target) {
  let low = 0;
  let high = nums.length - 1;
  while (low <= high) {
    let mid = (high + low) >> 1;
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] > target) {
      // -1，mid 本身被排除

      high = mid - 1;
    } else {
      // +1，mid 本身被排除
      low = mid + 1;
    }
  }

  return -1;
}
debugger;
search([1, 2, 3, 4, 5, 6, 7, 8], 8);

debugger;
search([1, 2, 3, 4, 5, 6, 7, 8], 4);
search([1, 2, 3, 4, 5, 6, 7, 8], -1);
search([1, 2, 3, 4, 5, 6, 7, 8], 0);
debugger;
search([1, 2, 3, 4, 5, 6, 7, 8], 8);
search([1, 2, 3, 4, 5, 6, 7, 8], 1);
