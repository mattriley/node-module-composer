const util = require('./util');
const eject = require('./eject');
const mermaid = require('./mermaid');

module.exports = (target, options = {}) => {

    const defaultOptions = {
        configKeys: ['defaultConfig', 'config', 'configs'],
        customiserFunction: 'setup',
        customiser: m => m[opts.customiserFunction] ? m[opts.customiserFunction]() : m
    };

    let ended = false;
    const opts = util.merge({}, defaultOptions, options);
    const configs = util.flattenDeep(util.pickValues(options, opts.configKeys));
    const config = util.merge({}, ...configs);
    const modules = { ...target };
    const dependencies = util.mapValues(modules, () => []);
    const composedDependencies = {};
    const stats = { totalDuration: 0, modules: {} };
    const propTargets = { target, config, modules, dependencies, composedDependencies, stats };

    const recurse = (target, parentKey, [moduleArgs, ...otherArgs]) => {
        if (!util.isPlainObject(target)) return target;
        const product = {};
        const newModulesArgs = { ...moduleArgs };
        util.set(newModulesArgs, parentKey, product);
        const newArgs = [newModulesArgs, ...otherArgs];
        const evaluate = (val, key) => util.isPlainFunction(val) ? val(...newArgs) : recurse(val, key, newArgs);
        const newObj = util.mapValues(target, evaluate);
        return Object.assign(product, newObj);
    };

    const baseCompose = (key, moduleArgs = {}, ...otherArgs) => {
        if (ended) throw new Error('Composition has ended');
        if (!util.has(target, key)) throw new Error(`${key} not found`);
        const moduleArgsWithDefaults = { ...options.defaults, ...moduleArgs };
        const module = opts.customiser(recurse(util.get(target, key), key, [moduleArgsWithDefaults, ...otherArgs]) ?? {});
        util.set(modules, key, util.override({ [key]: module }, options.overrides)[key]);
        dependencies[key] = composedDependencies[key] = Object.keys(moduleArgsWithDefaults);
        return modules;
    };

    const timedCompose = (...args) => {
        const startTime = performance.now();
        const result = baseCompose(...args);
        const duration = performance.now() - startTime;
        util.set(stats.modules, [args[0], 'duration'], duration);
        stats.totalDuration += duration;
        return result;
    };

    const propEntries = Object.entries(propTargets).flatMap(([key, val]) => [
        [key, { get() { return { ...val }; } }]
    ]).concat([
        ['mermaid', { value: opts => mermaid(dependencies, opts) }],
        ['eject', { value: () => eject(target, composedDependencies) }]
    ]);

    const props = Object.fromEntries(propEntries);
    const compose = performance ? timedCompose : baseCompose;
    compose.end = () => { ended = true; return Object.defineProperties({}, props); };
    Object.defineProperties(compose, props);

    return { compose, config };

};
