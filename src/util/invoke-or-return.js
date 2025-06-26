const isPlainFunction = require('./is-plain-function');

module.exports = (target, ...args) => {

    return target && isPlainFunction(target) ? target(...args) : target;

}
