const compose = require('./compose');
const collapse = require('./collapse');
const override = require('./override');

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
