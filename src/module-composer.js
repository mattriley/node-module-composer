const { merge, isObject, isFunction, mapValues, override } = require('./util');

module.exports = (parent, options = {}) => {
    merge(options, { defaults: {}, overrides: {} }, options);
    const modules = { ...parent }, dependencies = mapValues(modules, () => []);
    const getModules = () => ({ ...modules });
    const getDependencies = () => ({ ...dependencies });
    const compose = (key, arg = {}, initialise) => {
        arg = { ...options.defaults, ...arg };
        delete arg[key];
        const obj = parent[key];
        const composed = composeRecursive(obj, arg, key);
        const initialised = initialise ? initialise(composed) : composed;
        const module = override({ [key]: initialised }, options.overrides)[key];
        modules[key] = module;
        dependencies[key] = Object.keys(arg);
        return module;
    };
    return Object.assign(compose, { getModules, getDependencies });
};

const composeRecursive = (obj, arg, parentKey) => {
    if (!isObject(obj)) return obj;
    const product = {};
    const newArg = { [parentKey]: product, ...arg };
    const newObj = mapValues(obj, (val, key) => (isFunction(val) ? val(newArg) : composeRecursive(val, newArg, key)));
    return Object.assign(product, newObj);
};
