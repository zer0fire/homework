var imgList; //装按钮的数组
var cover = 0;
//窗体载入事件
window.onload = function () {
  var container = document.getElementById("Container");
  imgList = container.children;
  //给开始游戏按钮绑定事件
  document.getElementById("Button").addEventListener("click", PlayGame);
};

//随机函数low表示最小随机值，high表示最大随机值
function randomBetween(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}
//开始游戏方法，用于绑定开始游戏按钮
function PlayGame() {
  console.log(cover);
  imgList[cover].style.opacity = "1";
  SetBorder("2");
  var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (var i = 0; i < 8; i++) {
    var rmNum = randomBetween(i, 8);
    var temp = nums[i];
    nums[i] = nums[rmNum];
    nums[rmNum] = temp;
  }
  for (var i = 0; i < 9; i++) {
    imgList[i].src = "img/" + nums[i] + ".png";
  }
  cover = randomBetween(0, 8);
  imgList[cover].style.opacity = "0";
}
//单击数字时的事件
function Btn_Click(index) {
  if (
    (Math.abs(index - cover) == 1 &&
      Math.floor(index / 3) == Math.floor(cover / 3)) ||
    Math.abs(index - cover) == 3
  ) {
    var temp = imgList[cover].src;
    imgList[cover].src = imgList[index].src;
    imgList[index].src = temp;
    imgList[cover].style.opacity = "1";
    imgList[index].style.opacity = "0";
    cover = index;
  }
  //判定是否游戏结束
  for (var i = 0; i < 9; i++) {
    var str = imgList[i].src;
    if (str[str.length - 5] != i + 1) {
      break;
    }
    if (i == 8) {
      imgList[cover].style.opacity = "1";
      SetBorder("0");
      alert("闯关成功！");
    }
  }
}
//设置图片边框
function SetBorder(width) {
  for (var i = 0; i < 9; i++) {
    imgList[i].style.border = width + "px solid darkgoldenrod";
  }
}
