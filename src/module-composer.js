const util = require('./util');

module.exports = (target, ...configs) => {
    const config = util.merge({}, ...configs.flat());
    const options = util.merge({ customiser: util.defaultCustomiser() }, config.moduleComposer);
    const modules = { ...target }, dependencies = util.mapValues(modules, () => []);
    const mermaid = opts => util.mermaid(dependencies, opts);
    const composition = { config, target, modules, dependencies, mermaid };
    const getModules = () => ({ config, composition, ...modules });

    const recurse = (target, args, parentKey) => {
        if (!util.isPlainObject(target)) return target;
        const product = {};
        const newArg = { [parentKey]: product, ...args };
        const evaluate = (val, key) => util.isPlainFunction(val) ? val(newArg) : recurse(val, newArg, key);
        const newObj = util.mapValues(target, evaluate);
        return Object.assign(product, newObj);
    };

    const compose = (key, args = {}, customise = options.customiser) => {
        const totalArgs = { ...options.defaults, ...args };
        const module = customise(recurse(target[key], totalArgs, key));
        modules[key] = util.override({ [key]: module }, options.overrides)[key];
        dependencies[key] = Object.keys(totalArgs);
        return getModules();
    };

    return { config, compose, getModules, mermaid };
};
