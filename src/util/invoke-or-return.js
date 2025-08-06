module.exports = (target, ...args) => {

    return target && typeof target === 'function' ? target(...args) : target;

}
