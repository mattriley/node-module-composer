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
        const module = override({ [key]: composed }, overrides)[key];
        const initialise = isFunction(module[key]) ? module[key] : () => module;
        const result = initialise();
        Object.assign(modules, { [key]: result });
        Object.assign(dependencies, { [key]: Object.keys(arg) });
        return result;
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
