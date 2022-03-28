const { isObject, isFunction, mapValues, override } = require('./util');

module.exports = (parent, defaults = {}, overrides = {}) => {
    const modules = { ...parent }, dependencies = mapValues(modules, () => []);
    const done = () => ({ modules: { ...modules }, dependencies: { ...dependencies } });
    const compose = (key, arg = {}) => {
        arg = { ...defaults, ...arg };
        delete arg[key];
        const composed = composeRecursive(parent[key], arg, key);
        const module = override({ [key]: composed }, overrides)[key];
        dependencies[key] = Object.keys(arg);
        modules[key] = module;
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
