const mermaid = require('./mermaid');
const eject = require('./eject');
const util = require('./util');

module.exports = (target, options = {}) => {
    const defaultOptions = {
        configKeys: ['defaultConfig', 'config', 'configs'],
        customiserFunction: 'setup',
        customiser: m => m[opts.customiserFunction] ? m[opts.customiserFunction]() : m
    };

    const opts = util.merge({}, defaultOptions, options);
    const configs = util.flattenDeep(util.pickValues(options, opts.configKeys));
    const config = util.merge({}, ...configs);
    const modules = { ...target };
    const dependencies = util.mapValues(modules, () => []);
    const composedDependencies = {};
    const propTargets = { target, config, modules, dependencies, composedDependencies };

    const recurse = (target, args, parentKey) => {
        if (!util.isPlainObject(target)) return target;
        const product = {};
        const newArg = { ...args };
        util.set(newArg, parentKey, product);
        const evaluate = (val, key) => util.isPlainFunction(val) ? val(newArg) : recurse(val, newArg, key);
        const newObj = util.mapValues(target, evaluate);
        return Object.assign(product, newObj);
    };

    const compose = (key, args = {}, customise = opts.customiser) => {
        if (!util.has(target, key)) throw new Error(`${key} not found`);
        const totalArgs = { ...options.defaults, ...args };
        const module = customise(recurse(util.get(target, key), totalArgs, key) ?? {});
        util.set(modules, key, util.override({ [key]: module }, options.overrides)[key]);
        dependencies[key] = composedDependencies[key] = Object.keys(totalArgs);
        return modules;
    };

    const props = Object.entries(propTargets).flatMap(([key, val]) => [
        [`get${util.upperFirst(key)}`, { value: () => ({ ...val }) }],
        [key, { get() { return { ...val }; } }]
    ]).concat([
        ['mermaid', { value: opts => mermaid(dependencies, opts) }],
        ['eject', { value: () => eject(target, composedDependencies) }]
    ]).map(([key, def]) => [key, { ...def, enumerable: true }]);

    const composition = compose.composition = Object.defineProperties({}, Object.fromEntries(props));
    Object.defineProperties(compose, Object.fromEntries(props));
    return { compose, composition, config };
};
