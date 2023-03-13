/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function searchInsert(nums, target) {
  let low = 0;
  let high = nums.length - 1;
  let ans;
  while (low <= high) {
    let mid = (high + low) >> 1;
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] > target) {
      // -1，mid 本身被排除
      ans = mid;
      high = mid - 1;
    } else {
      // +1，mid 本身被排除
      low = mid + 1;
    }
  }
  return ans;
}

searchInsert([1, 3, 5, 6], 0);
