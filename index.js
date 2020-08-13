/* eslint-disable no-underscore-dangle */
const merge = require('lodash.merge');

const mapValues = (obj, arg) => {
    const process = val => (val instanceof Function ? val(arg) : compose(val, arg));
    return Object.entries(obj).reduce((acc, [key, val]) => Object.assign(acc, { [key]: process(val) }), {});
};

const compose = (obj, arg) => {
    const { __modulename, ...entries } = obj;
    const product = {}; 
    const newArg = { [__modulename]: product, ...arg };
    return Object.assign(product, mapValues(entries, newArg));
};

const collapse = (obj, parentObj, parentKey) => {
    if (obj && typeof obj === 'object') {
        Object.entries(obj).forEach(([key, val]) => {        
            if (key === parentKey) {
                parentObj[key] = Object.assign(val, parentObj[key]);
                delete val[key];
            }
            collapse(val, obj, key);
        });
    }
    return obj;
};

module.exports = (obj, arg, override = {}) => {
    const { __modulename } = obj;
    if (!__modulename) return obj;
    const result = collapse(compose({ __modulename, [__modulename]: obj }, arg));
    return merge(result, result[__modulename], override);
};
