const Module = require("module");

let originalPrefix = Module.wrapper[0];
let originalSuffix = Module.wrapper[1];
let currentModule;
let nodeRequire;

module.exports = function (modulePath) {
  const moduleFullPath = Module._resolveFilename(modulePath, require.main);

  const prefix = `let mf = function xxx(){`;
  const suffix = `} 
               ${codeToExportPrivateFuncs()}
  `;

  Module.wrapper[0] = Module.wrapper[0] + prefix;
  Module.wrapper[1] = suffix + Module.wrapper[1];

  const targetModule = new Module(moduleFullPath, require.main);

  nodeRequire = require;
  targetModule.require = requireProxy;
  currentModule = targetModule;

  targetModule.load(targetModule.id);

  reset();

  return targetModule.exports;
};

function codeToExportPrivateFuncs() {
  return `
  let mc = mf.toString();
  mc = mc.replace("function xxx(){", "");
  mc = mc.substring(0, mc.lastIndexOf("}"));

  let exportCodeBlock = "";

  let regex = /^function\\s+(\\w+)(?=\\s*\\()/gm;
  let matches = [...mc.matchAll(regex)];
  for (const match of matches) {
    exportCodeBlock += \`module.exports.\$\{match[1]\} = \$\{match[1]\};\`;
  }

  regex = /^(?:const|let|var)\\s*(\\S+)\\s*=\\s*(?:function|\\()/gm;
  matches = [...mc.matchAll(regex)];
  for (const match of matches) {
    exportCodeBlock += \`module.exports.\$\{match[1]\} = \$\{match[1]\};\`;
  }

  mc = mc + exportCodeBlock;

  eval(mc);`;
}

function reset() {
  Module.wrapper[0] = originalPrefix;
  Module.wrapper[1] = originalSuffix;
}
function requireProxy(path) {
  reset();
  currentModule.require = nodeRequire;
  return nodeRequire.call(currentModule, path);
}
