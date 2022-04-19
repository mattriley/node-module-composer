const { isObject, isFunction, mapValues, override } = require('./util');

module.exports = (parent, options = {}) => {
    const modules = { ...parent }, dependencies = mapValues(modules, () => []);
    modules.composition = { modules, dependencies };
    return (key, args = {}, customise = m => m) => {
        args = { ...options.defaults, ...args };
        delete args[key];
        const target = parent[key];
        const module = customise(composeRecursive(target, args, key));
        modules[key] = override({ [key]: module }, options.overrides)[key];
        dependencies[key] = Object.keys(args);
        return { ...modules };
    };
};

const composeRecursive = (target, args, parentKey) => {
    if (!isObject(target)) return target;
    const product = {};
    const newArg = { [parentKey]: product, ...args };
    const newObj = mapValues(target, (val, key) => (isFunction(val) ? val(newArg) : composeRecursive(val, newArg, key)));
    return Object.assign(product, newObj);
};
