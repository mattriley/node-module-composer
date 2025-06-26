module.exports = val => {

    return typeof val === 'function' && !Object.prototype.hasOwnProperty.call(val, 'prototype');

}
