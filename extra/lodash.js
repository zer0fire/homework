let zer0fire;
(function () {
  function map(collection, callback) {
    for (const key in collection) {
      collection[key] = callback(collection[key], key, collection);
    }
    return collection;
  }
  function identity(arg) {
    return arg;
  }
  function iteratee(func = identity) {
    return function (arg) {
      if (typeof func !== "function") {
        if (typeof property === "object") {
          // is an array or object
          let collection = func;
          if (Array.isArray(collection)) {
          } else {
            for (const key in collection) {
              // { user: 'name'}
              if (arg[key] !== collection[key]) {
                return false;
              }
            }
            return true;
          }
          // returns true for elements that contain the equivalent (等效) source properties,
          // otherwise (否则) it returns false.
        } else {
          let property = func;
          // is a property name
          return arg[property];
          // returns the property value for a given element
        }
      } else {
      }
    };
  }

  zer0fire = {
    iteratee,
    identity,
    map,
  };
})();
