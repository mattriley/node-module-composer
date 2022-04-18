const { isObject, isFunction, mapValues, override } = require('./util');

module.exports = (parent, options = {}) => {
    const modules = { ...parent }, dependencies = mapValues(modules, () => []);
    modules.composition = { modules, dependencies };
    return (key, arg = {}, customise) => {
        arg = { ...options.defaults, ...arg };
        delete arg[key];
        const obj = parent[key];
        const composed = composeRecursive(obj, arg, key);
        const initialised = customise ? customise(composed) : composed;
        const module = override({ [key]: initialised }, options.overrides)[key];
        modules[key] = module;
        dependencies[key] = Object.keys(arg);
        return { ...modules };
    };
};

const composeRecursive = (obj, arg, parentKey) => {
    if (!isObject(obj)) return obj;
    const product = {};
    const newArg = { [parentKey]: product, ...arg };
    const newObj = mapValues(obj, (val, key) => (isFunction(val) ? val(newArg) : composeRecursive(val, newArg, key)));
    return Object.assign(product, newObj);
};
