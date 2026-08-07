import { add, subtract, multiply } from "./utils/math.js";
import capitalize  from "./utils/strings.js";

const adder = add(5, 3);
const sub = add(5, 3);
const mul = multiply(5, 3);
const strRes = capitalize("hello");

console.log(adder, sub, mul, strRes);
console.log(import.meta.url);

// __filename does not exist in ES Modules because ESM does not use the CommonJS wrapper function that provides
// special variables like __filename and __dirname.
// ES Modules are designed to work in different environments, including browsers, so they use URLs instead of Node.js-specific file paths. 
// The equivalent of __filename in ESM is import.meta.url, which provides the current module's URL.