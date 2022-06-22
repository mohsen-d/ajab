const ajab = require("./index");
const sampleModule = ajab("./sample");

test("normal exported function should work fine", () => {
  expect(sampleModule.sum(1, 2)).toBe(3);
});

test("private function declaration should work fine", () => {
  expect(sampleModule.areNumbers(1, 2)).toBe(true);
});

test("private function expression should work fine", () => {
  expect(sampleModule.areInRange(1, 2)).toBe(true);
});

test("private arrow should work fine", () => {
  expect(sampleModule.isInRange(50)).toBe(true);
});
