const merge = require('lodash.merge');
const pick = require('lodash.pick');

module.exports = (parent, options) => {
    options = options || {};
    const overrides = options.overrides || {};

    return (key, arg) => {
        const obj = parent[key];
        const composed = compose(obj, arg, key);
        const collapsed = collapse({ [key]: composed });
        const result = override(collapsed, overrides);
        return result[key];
    };
};

const compose = (obj, arg, parentKey) => {
    if (typeof obj !== 'object') return obj;
    const product = {}; 
    const newArg = { [parentKey]: product, ...arg };
    return Object.assign(product, invokeEntries(obj, newArg));
};

const invokeEntries = (obj, arg) => {    
    return Object.entries(obj).reduce((acc, [key, val]) => {
        const newVal = typeof val === 'function' ? val(arg) : compose(val, arg, key);
        return Object.assign(acc, { [key]: newVal });
    }, {});
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

const override = (obj, overrides) => {
    return merge(obj, pick(overrides, Object.keys(obj)));
};
