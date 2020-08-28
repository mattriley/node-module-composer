const forEach = require('lodash/forEach');
const isFunction = require('lodash/isFunction');
const isPlainObject = require('lodash/isPlainObject');
const mapValues = require('lodash/mapValues');
const merge = require('lodash/merge');
const pick = require('lodash/pick');

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
    if (!isPlainObject(obj)) return obj;
    const product = {}; 
    const newArg = { [parentKey]: product, ...arg };
    return Object.assign(product, invokeEntries(obj, newArg));
};

const invokeEntries = (obj, arg) => mapValues(obj, (val, key) => (isFunction(val) ? val(arg) : compose(val, arg, key)));

const collapse = (obj, parentObj, parentKey) => {
    if (isPlainObject(obj)) {
        forEach(obj, (val, key) => {
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
