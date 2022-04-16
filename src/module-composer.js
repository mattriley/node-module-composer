const { merge, isObject, isFunction, mapValues, override } = require('./util');

module.exports = (parent, options = {}) => {
    const opt = merge({
        defaults: {}, overrides: {},
        compositionModule: { enabled: true, name: 'composition' }
    }, options);
    const modules = { ...parent }, dependencies = mapValues(modules, () => []);
    if (opt.compositionModule.enabled) modules[opt.compositionModule.name] = { modules, dependencies };
    const compose = (key, arg = {}, initialise) => {
        arg = { ...opt.defaults, ...arg };
        delete arg[key];
        const obj = parent[key];
        const composed = composeRecursive(obj, arg, key);
        const initialised = initialise ? initialise(composed) : composed;
        const module = override({ [key]: initialised }, opt.overrides)[key];
        modules[key] = module;
        dependencies[key] = Object.keys(arg);
        return module;
    };
    return Object.assign(compose, { modules, dependencies });
};

const composeRecursive = (obj, arg, parentKey) => {
    if (!isObject(obj)) return obj;
    const product = {};
    const newArg = { [parentKey]: product, ...arg };
    const newObj = mapValues(obj, (val, key) => (isFunction(val) ? val(newArg) : composeRecursive(val, newArg, key)));
    return Object.assign(product, newObj);
};
