const _ = require('lodash');

const mapValues = (obj, arg) => {
    return _.mapValues(obj, val => _.isFunction(val) ? val(arg) : compose(val, arg));
};

const compose = (obj, arg) => {
    const { __modulename, ...entries } = obj;
    if (!__modulename) return obj;
    const product = {};
    const newArg = { [__modulename]: product, ...arg };
    return Object.assign(product, mapValues(entries, newArg));
};

module.exports = compose;
