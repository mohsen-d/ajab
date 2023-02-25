const path = require("path");

const isInRange = (v) => v > 0 && v < 100;

function sum(a, b) {
  const areInRange = function (a, b) {
    return isInRange(a) && isInRange(b);
  };

  function getPath() {
    return path.resolve("./sample.js");
  }

  if (areNumbers(a, b) && areInRange(a, b)) return a + b;
  return 0;
}

function areNumbers(a, b) {
  return !isNaN(a) && !isNaN(b) && isInRange(a);
}

module.exports.sum = sum;
