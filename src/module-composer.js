const { isObject, isFunction, mapValues, override, merge } = require('./util');

module.exports = (target, ...configs) => {
    const config = merge({}, ...configs);
    const { moduleComposer: options = {} } = config;
    const modules = { ...target }, dependencies = mapValues(modules, () => []);
    const composition = { config, target, modules, dependencies };
    const compose = (key, args = {}, customise = m => m) => {
        const totalArgs = { ...options.defaults, ...args };
        const composed = composeRecursive(target[key], totalArgs, key);
        const module = customise(composed);
        modules[key] = override({ [key]: module }, options.overrides)[key];
        dependencies[key] = Object.keys(totalArgs);
        return { config, composition, ...modules };
    };
    return { compose, composition, config };
};

const composeRecursive = (target, args, parentKey) => {
    if (!isObject(target)) return target;
    const product = {};
    const newArg = { [parentKey]: product, ...args };
    const newObj = mapValues(target, (val, key) => (isFunction(val) ? val(newArg) : composeRecursive(val, newArg, key)));
    return Object.assign(product, newObj);
};
