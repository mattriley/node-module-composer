const isFunction = require('lodash/isFunction');
const isPlainFunction = val => isFunction(val) && !val.hasOwnProperty('prototype');

module.exports = (target, ...args) => {
    return target && isPlainFunction(target) ? target(...args) : target;
}
