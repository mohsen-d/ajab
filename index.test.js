const path = require("path");
const ajab = require("./index");
const sampleModule = ajab("./sample");
const nonObjectExportsModule = ajab("./nonObjectExports");

jest.mock("path");

path.resolve.mockReturnValue("path.resolve is mocked");

describe("module.exports is an object", () => {
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
  test("mocking dependencies should work normally", () => {
    expect(sampleModule.getPath()).toBe("path.resolve is mocked");
  });
});

describe("module.exports is a function", () => {
  test("normal exported function should work fine", () => {
    expect(nonObjectExportsModule.public(1, 2)).toBe(3);
  });
  test("private function declaration should work fine", () => {
    expect(nonObjectExportsModule.areNumbers(1, 2)).toBe(true);
  });
  test("private function expression should work fine", () => {
    expect(nonObjectExportsModule.areInRange(1, 2)).toBe(true);
  });
  test("private arrow should work fine", () => {
    expect(nonObjectExportsModule.isInRange(50)).toBe(true);
  });
  test("mocking dependencies should work normally", () => {
    expect(nonObjectExportsModule.getPath()).toBe("path.resolve is mocked");
  });
});
