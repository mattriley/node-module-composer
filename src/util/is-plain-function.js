module.exports = val => {

    return val && typeof val === 'function' &&
        !Object.prototype.hasOwnProperty.call(val, 'prototype');

}
