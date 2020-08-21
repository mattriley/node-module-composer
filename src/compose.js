const mapValues = (obj, arg) => {
    const process = (val, key) => (typeof val === 'function' ? val(arg) : (typeof val === 'object' ? compose(val, arg, key) : val));
    return Object.entries(obj).reduce((acc, [key, val]) => Object.assign(acc, { [key]: process(val, key) }), {});
};

const compose = (obj, arg, parentKey) => {
    const product = {}; 
    const newArg = { [parentKey]: product, ...arg };
    return Object.assign(product, mapValues(obj, newArg));
};

module.exports = compose;
