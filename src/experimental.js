const { isObject, isFunction, mapValues, override } = require('./util');

module.exports = (parent, defaults = {}, overrides = {}) => {
    const modules = {}, dependencies = {};
    const addModules = obj => {
        Object.assign(modules, obj);
        Object.assign(dependencies, mapValues(modules, () => []))
    };
    addModules({ ...parent });
    const compose = (key, arg = {}) => {
        arg = { ...defaults, ...arg };
        delete arg[key];
        const obj = parent[key];
        const composed = composeRecursive(obj, arg, key);
        const initialise = isFunction(composed[key]) ? composed[key] : () => composed;
        const module = override({ [key]: initialise() }, overrides)[key];
        modules[key] = module;
        dependencies[key] = Object.keys(arg);
        return module;
    };
    return Object.assign(compose, {
        default: (key, arg) => defaults[key] = compose(key, arg),
        addDefaults: obj => { Object.assign(defaults, obj); },
        addModules,
        getModule: key => modules[key],
        getModules: () => ({ ...modules }),
        getDependencies: () => ({ ...dependencies }),
        done: () => ({ modules, dependencies })
    });
};

const composeRecursive = (obj, arg, parentKey) => {
    if (!isObject(obj)) return obj;
    const product = {};
    const newArg = { [parentKey]: product, ...arg };
    const newObj = mapValues(obj, (val, key) => (isFunction(val) ? val(newArg) : composeRecursive(val, newArg, key)));
    return Object.assign(product, newObj);
};
