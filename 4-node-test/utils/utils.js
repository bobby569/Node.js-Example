const add = (a, b) => a + b;
const square = x => x * x;
const asycAdd = (a, b, cb) => setTimeout(() => cb(a + b), 1000);

module.exports = { add, square, asycAdd };
