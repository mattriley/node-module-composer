
const invokeEntries = (obj, arg) => {    
    return Object.entries(obj).reduce((acc, [key, val]) => {
        const newVal = typeof val === 'function' ? val(arg) : compose(val, arg, key);
        return Object.assign(acc, { [key]: newVal });
    }, {});
};


const compose = (obj, arg, parentKey) => {
    if (typeof obj !== 'object') return obj;
    const product = {}; 
    const newArg = { [parentKey]: product, ...arg };
    return Object.assign(product, invokeEntries(obj, newArg));
};

module.exports = compose;
