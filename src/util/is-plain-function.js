const isFunction = require('lodash/isFunction');

module.exports = val => {
    return isFunction(val) && !val.hasOwnProperty('prototype');
}
