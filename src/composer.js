const compose = require('./compose');
const collapse = require('./collapse');
const override = require('./override');

module.exports = (parent, options, cb) => {
    options = options || {};
    const overrides = options.overrides || {};
    const acc = {};

    const process = (key, arg, cb) => {
        const obj = parent[key];
        const composed = compose(obj, arg, key);
        const collapsed = collapse({ [key]: composed });
        const transformed = cb ? cb(collapsed[key]) : collapsed;
        const result = override(transformed, overrides);
        Object.assign(acc, result);        
        return cb ? result : result[key];
    };

    return cb ? (cb(process), acc) : process;
    
};
