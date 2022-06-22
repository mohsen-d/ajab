module.exports.sum = function sum(a, b) {
  if (areNumbers(a, b) && areInRange(a, b)) return a + b;
  return 0;
};

function areNumbers(a, b) {
  return !isNaN(a) && !isNaN(b);
}

const areInRange = function (a, b) {
  return isInRange(a) && isInRange(b);
};

const isInRange = (v) => v > 0 && v < 100;
