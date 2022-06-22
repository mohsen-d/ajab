const ajab = require("./index");
const sampleModule = ajab("./sample");

test("normal exported function should work fine", () => {
  expect(sampleModule.sum(1, 2)).toBe(3);
});

test("private function declaration should work fine", () => {
  expect(sampleModule.areNumbers(1, 2)).toBe(true);
});
