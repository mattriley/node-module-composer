const invokeOrReturn = require('./invoke-or-return');

module.exports = (...funs) => {
    const acc = {};
    for (const fun of funs) { Object.assign(acc, invokeOrReturn(fun, acc)); }
    return acc;
};
