const _ = require('lodash');

const vals = (obj, arg) => {
    return _.mapValues(obj, val => _.isFunction(val) ? val(arg) : init(val, arg));
};

const init = (obj, arg) => {
    const { __modulename, ...entries } = obj;
    if (!__modulename) return obj;
    const product = {};
    const newArg = { [__modulename]: product, ...arg };
    return Object.assign(product, vals(entries, newArg));
};

module.exports = init;
