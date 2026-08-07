1.
In the commonjs if we had written exports = { add, subtract, multiply} and then try to require it from the other file for example index.js require would return empty object.
this happens because exports is simply just a reference(pointer) to module.exports.
So when we write exports = { add, subtract, multiply} we just move that reference(pointer) from module.exports object to new object. require() always returns the value of module.exports, not exports. Since module.exports was never modified and still points to the original empty object, require() returns {}.

2.
In math.js, we could have used module.exports because it would produce the same result. The main difference is that module.exports is more convenient when exporting an entire object at once, while exports.xxx = ... is more convenient when we need or want to export values one by one.

3.
The main reason is that in CommonJS when require resolves a module it automaticly checks its files extensions for example if we write require('./utils/math') Node.js will try to find ./utils/math, ./utils/math.js, ./utils/math.json, ./utils/math.node. In ES Modules imports are designed to work like URLs. The path must point to the exact file so the extension is required. It doesnt check whether the file has extension of js, json or node.

4.
CommonJS uses synchronous module loading, meaning modules are loaded and executed when require() is called. It supports dynamic module paths because require() is a regular function that can be invoked anywhere in the code.
ES Modules use asynchronous module loading, where module dependencies are resolved before the module is executed. ESM uses the static import and export syntax, which must appear at the top level of a module, enabling static analysis and tree shaking by bundlers.