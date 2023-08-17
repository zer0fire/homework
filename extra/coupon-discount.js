function comBine(arr1, arr2) {
  let list = [];
  for (var i = 0; i < arr1.length; i++) {
    for (var k = 0; k < arr2.length; k++) {
      if (i == k) {
        list.push({
          price: arr1[i],
          num: arr2[k],
        });
      }
    }
  }
  return list;
}
function get(p, o, a, d) {
  let productIndexArr = [];
  let productNumArr = [];
  let priceArr = [];
  let priceList = [];
  let sum = 0;
  for (var i = 0; i < o.length; i++) {
    if (i % 2 == 0) {
      productIndexArr.push(o[i]);
    } else {
      productNumArr.push(o[i]);
    }
  }
  productIndexArr.map((item) => {
    priceArr.push(p[item]);
  });
  let result = comBine(priceArr, productNumArr);
  sum = result.reduce((pre, item) => {
    return Number(pre + item.price * item.num);
  }, 0);
  console.log(`商品总价是$${sum}`);

  //第三步添加新的唯独商品索引值
  let allList = result.map((item, index) => {
    for (var l = 0; l < productIndexArr.length; l++) {
      if (index == l) {
        return {
          price: item.price,
          num: item.num,
          produceIndex: productIndexArr[l],
        };
      }
    }
  });

  //将优惠价格转化为对象形式 方便对应关系
  let promotionsArr = a.map((item) => {
    if (item.length == 2) {
      return {
        indexP: item[0],
        numP: item[1],
      };
    } else {
      return {
        indexP: item[0],
        numP: item[1],
        indexP1: item[2],
        numP1: item[3],
      };
    }
  });
  //哪些商品可以有优惠
  let produceIndexIn = [];
  for (var i = 0; i < promotionsArr.length; i++) {
    if (promotionsArr[i].indexP1 !== undefined) {
      produceIndexIn.push(promotionsArr[i].indexP, promotionsArr[i].indexP1);
    } else {
      produceIndexIn.push(promotionsArr[i].indexP);
    }
  }
  //判断是否包括以下优惠情况
  console.log(allList);
  let canReducePriceList = allList.map((item) => {
    if (produceIndexIn.includes(item.produceIndex)) {
      return item;
    }
  });

  const PriceListExcept = canReducePriceList.filter((item) => Boolean(item));
  if (PriceListExcept.length) {
    console.log("此购买方案存在优惠");
    const buyIndex = PriceListExcept.map((item) => item.produceIndex);
    console.log(buyIndex);
    //判断是否有有组合优惠
    if (buyIndex.indexOf(2) !== -1 && buyIndex.indexOf(1) !== -1) {
      //说明存在组合优惠
      let reduce2 = 0;
      let numSpecial2;
      let numSpecial1;
      for (var h = 0; h < PriceListExcept.length; h++) {
        let currentItem = PriceListExcept[h];
        if (currentItem.produceIndex == 0) {
          reduce2 += parseInt(currentItem.num / 7) * d[0];
        } else if (currentItem.produceIndex == 4) {
          reduce2 += parseInt(currentItem.num / 10) * d[1];
        } else if (currentItem.produceIndex == 5) {
          reduce2 += parseInt(currentItem.num / 2) * d[3];
        }
      }
      PriceListExcept.map((item) => {
        if (item.produceIndex == 2) {
          numSpecial2 = item.num;
        } else if (item.produceIndex == 1) {
          numSpecial1 = item.num;
        }
      });
      let average2 = parseInt(numSpecial2 / 6);
      let average1 = parseInt(numSpecial2 / 9);
      if (average2 != average1) {
        reduce2 += average2 * d[2];
      } else {
        reduce2 += 5;
      }
      console.log(`优惠节省金钱了${reduce2}`);
    } else {
      let reduce1 = 0;
      for (var m = 0; m < PriceListExcept.length; m++) {
        let currentItem = PriceListExcept[m];
        if (currentItem.produceIndex == 0) {
          reduce1 += parseInt(currentItem.num / 7) * d[0];
        } else if (currentItem.produceIndex == 4) {
          reduce1 += parseInt(currentItem.num / 10) * d[1];
        } else if (currentItem.produceIndex == 5) {
          reduce1 += parseInt(currentItem.num / 2) * d[3];
        }
      }
      console.log(`优惠节省金钱${reduce1}`);
    }
  } else {
    //说明不存在优惠
    return Number(sum);
  }
}
get(
  [10, 5, 8, 8, 6, 3],
  [2, 17, 3, 10, 1, 27, 5, 2, 4, 9],
  [
    [0, 7],
    [4, 10],
    [2, 6, 1, 9],
    [5, 2],
  ],
  [4, 3, 5, 1]
);
