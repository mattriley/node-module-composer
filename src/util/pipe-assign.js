const invokeOrReturn = require('./invoke-or-return');

module.exports = (...funs) => {
    return funs.reduce((acc, fun) => ({ ...acc, ...invokeOrReturn(fun, acc) }), {});
};
