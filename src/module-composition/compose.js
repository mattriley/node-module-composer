const _ = require('lodash');

module.exports = ({ moduleComposition }) => (obj, arg = {}, opts = {}) => {
    const vals = (obj, arg) => {
        return _.mapValues(obj, val => _.isFunction(val) ? val(arg) : init(val, arg));
    };

    const init = (obj, arg) => {
        const { __modulename, ...entries } = obj;
        if (!__modulename) return obj;
        const product = {};
        const newArg = { [__modulename]: product, ...arg };
        const pipeline = _.flow(
            p => Object.assign(p, vals(entries, newArg)),
            p => opts.collapse ? Object.assign(p, moduleComposition.collapse(p)) : p
        );
        return pipeline(product);
    };

    return init(obj, arg);
};
