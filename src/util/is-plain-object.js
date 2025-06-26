module.exports = val => {

    return val !== null &&
        typeof val === 'object' &&
        Object.getPrototypeOf(val) === Object.prototype;

};
