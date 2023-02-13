function sleep(callback, time) {
  setTimeout(() => {
    callback();
  }, time);
}
