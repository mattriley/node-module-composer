const { isObject, isFunction, mapValues, override } = require('./util');

module.exports = (parent, options = {}) => {
    const modules = { ...parent }, dependencies = mapValues(modules, () => []);
    modules.composition = { modules, dependencies };
    return (key, args = {}, customise) => {
        args = { ...options.defaults, ...args };
        delete args[key];
        const obj = parent[key];
        const composed = composeRecursive(obj, args, key);
        const customised = customise ? customise(composed) : composed;
        modules[key] = override({ [key]: customised }, options.overrides)[key];
        dependencies[key] = Object.keys(args);
        return { ...modules };
    };
};

const composeRecursive = (obj, args, parentKey) => {
    if (!isObject(obj)) return obj;
    const product = {};
    const newArg = { [parentKey]: product, ...args };
    const newObj = mapValues(obj, (val, key) => (isFunction(val) ? val(newArg) : composeRecursive(val, newArg, key)));
    return Object.assign(product, newObj);
};
