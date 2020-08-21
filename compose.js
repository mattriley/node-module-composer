const mapValues = (obj, arg) => {
    const process = (val, key) => (typeof val === 'function' ? val(arg) : (typeof val === 'object' ? compose(val, arg, key) : val));
    return Object.entries(obj).reduce((acc, [key, val]) => Object.assign(acc, { [key]: process(val, key) }), {});
};

const compose = (obj, arg, parentKey) => {
    const product = {}; 
    const newArg = { [parentKey]: product, ...arg };
    return Object.assign(product, mapValues(obj, newArg));
};

const collapse = (obj, parentObj, parentKey) => {
    if (obj && typeof obj === 'object') {
        Object.entries(obj).forEach(([key, val]) => {        
            if (key === parentKey) {
                parentObj[key] = Object.assign(val, parentObj[key]);
                delete val[key];
            }
            collapse(val, obj, key);
        });
    }
    return obj;
};

module.exports = parent => (key, arg) => {
    const obj = parent[key];
    const composed = compose(obj, arg, key);
    const collapsed = collapse({ [key]: composed });
    return collapsed[key];
};
