const { isObject, isFunction, mapValues, override } = require('./util');

module.exports = (target, options = {}) => {
    const modules = { ...target }, dependencies = mapValues(modules, () => []);
    modules.composition = { modules, dependencies };
    return (key, args = {}, customise = m => m) => {
        const totalArgs = { ...options.defaults, ...args };
        const module = customise(composeRecursive(target[key], totalArgs, key));
        modules[key] = override({ [key]: module }, options.overrides)[key];
        dependencies[key] = Object.keys(totalArgs);
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
