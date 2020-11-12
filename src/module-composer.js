const { isObject, isFunction, mapValues, override } = require('./util');

module.exports = (parent, options = {}) => {
    const overrides = options.overrides || {};
    const modules = { ...parent };
    const dependencies = {};
    const compose = (key, arg = {}) => {
        arg = { ...arg };        
        delete arg[key];
        const obj = parent[key];
        const composed = composeRecursive(obj, arg, key);
        const initialise = isFunction(composed[key]) ? composed[key] : () => composed;
        const module = override({ [key]: initialise() }, overrides)[key];
        Object.assign(modules, { [key]: module });
        Object.assign(dependencies, { [key]: Object.keys(arg) });
        return module;
    };
    const getModules = () => ({ ...modules, __dependencies: { ...dependencies } });
    return Object.assign(compose, { getModules });
};

const composeRecursive = (obj, arg, parentKey) => {
    if (!isObject(obj)) return obj;
    const product = {}; 
    const newArg = { [parentKey]: product, ...arg };
    const newObj = mapValues(obj, (val, key) => (isFunction(val) ? val(newArg) : composeRecursive(val, newArg, key)));
    return Object.assign(product, newObj);
};
