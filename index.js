const fs = require("fs");
const { resolve } = require("path");

module.exports = function (modulePath) {
  const moduleFullPath = resolveThePath(modulePath);
  const moduleContent = fs.readFileSync(moduleFullPath, "utf8");

  const exportingPrivateFunctionsCodeBlock =
    exportPrivateFunctions(moduleContent);
  const finalContent = moduleContent + exportingPrivateFunctionsCodeBlock;
  eval(finalContent);
  return module.exports;
};

function resolveThePath(path) {
  let fullPath = resolve(path);
  if (!fullPath.endsWith(".js")) fullPath += ".js";
  return fullPath;
}

function exportPrivateFunctions(moduleContent) {
  const privateFunctionsRegex = /^function\s+(\w+)(?=\s*\()/gm;
  const matches = [...moduleContent.matchAll(privateFunctionsRegex)];
  let exportCodeBlock = "";
  for (const match of matches) {
    exportCodeBlock += `module.exports.${match[1]} = ${match[1]}; \r\n`;
  }
  return exportCodeBlock;
}
