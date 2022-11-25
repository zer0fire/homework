// getRect

/**
 *
 * @param {HTMLElement[]} domList
 */
function getRect() {
  return Array.from(document.querySelectorAll(".rect"));
}

/**
 *
 * @param {HTMLElement[]} domList
 */
function loopNode(viewPortWidth = 600) {
  const order = getRect();
  for (let i = 0; i < order.length; i++) {
    const node = order[i];
    if (node && node.getBoundingClientRect().x <= 0) {
      if (node.getBoundingClientRect().x === -200) {
        node.getBoundingClientRect().x = 600;
      } else if (node.getBoundingClientRect().x < -200) {
        const delta = 1024 + node.getBoundingClientRect().x;
        node.getBoundingClientRect().x = 1024 - delta;
      }
    }
  }
}
// 若第一张图的 node1.x 值小于 0 大于 -1024 , 则后面的图补上，node2.x - node1.x
// 直到 position <= 1024

function move() {
  const orderList = getRect();
  setInterval(() => {
    orderList.forEach((it) => {
      it.getBoundingClientRect().x += 2;
      loopNode();
    });
  }, 500);
}

move();
