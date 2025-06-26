const get = require('lodash/get');
const invokeOrReturn = require('./invoke-or-return');

module.exports = (obj, path, ...args) => {

    return invokeOrReturn(get(obj, path, obj), ...args);

}
