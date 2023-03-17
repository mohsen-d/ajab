const Module = require("module");
let originalPrefix = Module.wrapper[0];
let originalSuffix = Module.wrapper[1];
let currentModule;
let nodeRequire;

module.exports = function (modulePath) {
  const moduleFullPath = Module._resolveFilename(modulePath, require.main);

  const prefix = `let moduleContentWrapper = function mcw(){`;
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
  let moduleContent = moduleContentWrapper.toString();
  moduleContent = moduleContent.replace("function mcw(){", "");
  moduleContent = moduleContent.substring(0, moduleContent.lastIndexOf("}"));

  if(__filename.includes("node_modules")) return eval(moduleContent);
  
  exportCodeBlock_prefix = \`
    let funcs = {};
    let ajabIsManipulating = true;

    const extractFuncs = function () {
      let output = "";
      for (const funcName in funcs) {
        if (typeof funcs[funcName] !== "function") {
          output += \\\` if(typeof \\\${funcName} === "function") funcs['\\\${funcName}'] = \\\${funcName};\\\`;
        }
      }
      return output;
    };

  \`;
  
  let exportCodeBlock_suffix = \`\r\n

    if(typeof module.exports !== "object"){
      const originalExports = module.exports;
      module.exports = {
        public: originalExports
      };
    } 

    const toBeExported = module.exports;

    function thereIsNotExportedFunc(){
      return Object.entries(funcs).length > 0;
    }

    while(thereIsNotExportedFunc()){
      for (const funcName in funcs) {
        if (typeof funcs[funcName] === "function") {
          funcs[funcName]();
          toBeExported[funcName] = funcs[funcName];
          delete funcs[funcName];
        }
        else if(typeof toBeExported[funcName] === "function"){
          toBeExported[funcName]();
          delete funcs[funcName];
        }
      }
    }

    ajabIsManipulating = false;

  \`;

  let regex = /\\s*function\\s+(\\S+)\\s*\\((.*)\\)\\s*\\{/gm;
  moduleContent = moduleContent.replace(regex, function(match, p1, p2){
    exportCodeBlock_prefix += \`funcs.\${p1} = eval("typeof \${p1} !== 'undefined'") ? \${p1} : undefined;\`;

    return \`
    function \${p1} (\${p2}){
    if(ajabIsManipulating) return eval(extractFuncs());\`;
  });

  
  regex = /([^\\=\\:\\n]+(?!\\.))\\s*(?:\\:|\\=)\\s*(?:function)*((?:(?<=function)\\s+[^\\(\\)\\s]+)*)\\s*(?:\\()*([^\\)\\(\\=]*)(?:\\))*\\s*(?:=>)*\\s*\\{/gm
  moduleContent = moduleContent.replace(regex, function(match, p1, p2, p3){
    
    p1 = p1.trim();
    
    if(p1.includes("module.exports"))
    {
      if(p1 === "module.exports") p1 = "public";

      p1 = p1.replace(/(module|exports|\\.)/g, "");

      exportCodeBlock_prefix += \`funcs.\${p1} = eval("typeof \${p1} !== 'undefined'") ? \${p1} : undefined;\`;

      return \`
      \${match}
      if(ajabIsManipulating) return eval(extractFuncs());\`;
    }

    p1 = p1.replace(/(const|let|var)/, "");

    exportCodeBlock_prefix += \`funcs.\${p1} = eval("typeof \${p1} !== 'undefined'") ? \${p1} : undefined;\`;

     return \`
     function \${p1} (\${p3}){
      if(ajabIsManipulating) return eval(extractFuncs());\`;
  });

  regex = /(?:\\s*(?:const|let|var)\\s*([^\\s\\=]+)\\s*=\\s*(?:\\()*([^\\)\\(\\=]*)(?:\\))*\\s*(?:=>))(?!\\s*{)(.*)/gm;
  moduleContent = moduleContent.replace(regex, function(match, p1, p2, p3){
    exportCodeBlock_prefix += \`funcs.\${p1} = eval("typeof \${p1} !== 'undefined'") ? \${p1} : undefined;\`;

     return \`function \${p1} (\${p2}){return \${p3}}\`;
  });

  moduleContent =  exportCodeBlock_prefix + moduleContent + exportCodeBlock_suffix;
  //console.log(moduleContent);
  eval(moduleContent);`;
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
