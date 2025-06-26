module.exports = val => {

    return val && typeof val === 'object' &&
        Object.getPrototypeOf(val) === Object.prototype;

};
