const { isObject, isFunction, mapValues, override } = require('./util');

module.exports = (parent, defaults = {}, overrides = {}) => {
    const modules = { ...parent }, dependencies = mapValues(modules, () => []);
    const done = () => ({ modules: { ...modules }, dependencies: { ...dependencies } });
    const compose = (key, arg = {}, initialise) => {
        arg = { ...defaults, ...arg };
        delete arg[key];
        const obj = parent[key];
        const composed = composeRecursive(obj, arg, key);
        const initialised = initialise ? initialise(composed) : composed;
        const module = override({ [key]: initialised }, overrides)[key];
        modules[key] = module;
        dependencies[key] = Object.keys(arg);
        return module;
    };
    return Object.assign(compose, { done });
};

const composeRecursive = (obj, arg, parentKey) => {
    if (!isObject(obj)) return obj;
    const product = {};
    const newArg = { [parentKey]: product, ...arg };
    const newObj = mapValues(obj, (val, key) => (isFunction(val) ? val(newArg) : composeRecursive(val, newArg, key)));
    return Object.assign(product, newObj);
};
