const merge = require('lodash.merge');
const pick = require('lodash.pick');

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


module.exports = (parent, options, cb) => {
    const overrides = (options || {}).overrides || {};
    const results = {};


    const comp = (key, arg, cb) => {
        const obj = parent[key];
        const composed = compose(obj, arg, key);
        const result = collapse({ [key]: composed });
        const result2 = cb ? cb(result[key]) : result;

        Object.assign(results, result, result2);

        const res = Object.assign(result, result2);
        const fin = merge(res, pick(overrides, Object.keys(res)));
        return cb ? fin : fin[key];
    };


    if (!cb) {
        return comp;
    }
    
    cb(comp);

    return results;
};


// module.exports = (parent, options, cb) => {
//     const overrides = options.overrides ?? {};
//     const results = {};
    
//     cb((key, arg, cb) => {
//         const obj = parent[key];
//         const composed = compose(obj, arg, key);
//         const result = collapse({ [key]: composed });
//         const result2 = cb ? cb(result[key]) : result;

//         Object.assign(results, result, result2);

//         const res = Object.assign(result, result2);
//         const fin = merge(res, pick(overrides, Object.keys(res)));
//         return cb ? fin : fin[key];
//     });

//     return results;
// };

