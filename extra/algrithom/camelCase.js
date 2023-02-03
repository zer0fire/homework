const obj = {
  user_info: {
    user_address: {
      user_province: "Zhe Jiang",
    },
    user_name: "Joe Zhang",
    favorite_food: [
      {
        food_name: "curry",
        sense_of_taste: "spicy",
      },
      {
        food_name: "orange",
        food_type: "sweet",
      },
    ],
  },
  favorite_food1: [
    {
      food_name1: "curry",
      sense_of_taste1: "spicy",
    },
    {
      food_name1: "orange",
      food_type1: "sweet",
    },
  ],
};
function trans(value) {
  return value.replace(/(_)(.)/g, (...args) => {
    return args[2].toUpperCase();
  });
}
function camelCase(value) {
  if (typeof value === "string") {
    return trans(value);
  } else {
    const keys = Object.keys(value);
    for (let key of keys) {
      let newKey = trans(key);
      if (typeof value[key] === "object") {
        value[newKey] = camelCase(value[key]);
      } else {
        value[newKey] = value[key];
      }
      if (newKey !== key) {
        delete value[key];
      }
    }
    return value;
  }
}

camelCase(obj);
