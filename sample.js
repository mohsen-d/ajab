module.exports.sum = function sum(a, b) {
  if (areNumbers(a, b) && areInRange(a, b)) return a + b;
  return 0;
};

function areNumbers(a, b) {
  return !isNaN(a) && !isNaN(b);
}

const areInRange = function (a, b) {
  return a > 0 && a < 100 && b > 0 && b < 100;
};
