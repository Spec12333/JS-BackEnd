const add = require('./utils/math.js');
const string = require('./utils/strings.js');

const sub = add.subtract(5, 3);
const multiply = add.multiply(5, 3);
const adder = add.add(5, 3);
const stringRes = string("hello");

console.log(sub, multiply, adder, stringRes);
console.log(require.cache);