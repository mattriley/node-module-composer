const { isObject, isFunction, mapValues, override, merge } = require('./util');
const mermaidGraph = require('./mermaid-graph');
const defaultOptions = require('./default-options');

module.exports = (target, ...configs) => {
    const config = merge({}, ...configs.flat());
    const options = merge({ ...defaultOptions }, config.moduleComposer);
    const modules = { ...target }, dependencies = mapValues(modules, () => []);
    const mermaid = opts => mermaidGraph(dependencies, opts);
    const composition = { config, target, modules, dependencies, mermaid };
    const composed = () => ({ config, composition, ...modules });

    const composeRecursive = (target, args, parentKey) => {
        if (!isObject(target)) return target;
        const product = {};
        const newArg = { [parentKey]: product, ...args };
        const newObj = mapValues(target, (val, key) => (isFunction(val) ? val(newArg) : composeRecursive(val, newArg, key)));
        return Object.assign(product, newObj);
    };

    const compose = (key, args = {}, customise = options.customiser) => {
        const totalArgs = { ...options.defaults, ...args };
        const module = customise(composeRecursive(target[key], totalArgs, key));
        modules[key] = override({ [key]: module }, options.overrides)[key];
        dependencies[key] = Object.keys(totalArgs);
        return composed();
    };

    return { config, compose, composed, mermaid };
};
