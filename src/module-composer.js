const util = require('./util');
const eject = require('./eject');
const mermaid = require('./mermaid');

module.exports = (target, userOptions = {}) => {

    const defaultOptions = {
        stats: true,
        configKeys: ['defaultConfig', 'config', 'configs'],
        customiserFunction: 'setup',
        customiser: m => m[options.customiserFunction] ? m[options.customiserFunction]() : m
    };

    let ended = false;
    const options = util.merge({}, defaultOptions, userOptions);
    const props = {
        defaultOptions,
        userOptions,
        options,
        target,
        config: util.mergeConfig(userOptions, options.configKeys),
        modules: { ...target },
        dependencies: util.mapValues(target, () => []),
        composedDependencies: {},
        stats: { totalDuration: 0, modules: {} }
    };

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
        const module = options.customiser(recurse(util.get(target, key), key, [moduleArgsWithDefaults, ...otherArgs]) ?? {});
        util.set(props.modules, key, util.override({ [key]: module }, options.overrides)[key]);
        props.dependencies[key] = props.composedDependencies[key] = Object.keys(moduleArgsWithDefaults);
        return props.modules;
    };

    const timedCompose = (key, moduleArgs = {}, ...otherArgs) => {
        const startTime = performance.now();
        const result = baseCompose(key, moduleArgs, ...otherArgs);
        const duration = performance.now() - startTime;
        util.set(props.stats.modules, [key, 'duration'], duration);
        props.stats.totalDuration += duration;
        return result;
    };

    const assignProps = obj => Object.assign(util.defineGetters(obj, props), {
        mermaid: opts => mermaid(props.dependencies, opts),
        eject: () => eject(target, props.composedDependencies)
    });

    const compose = assignProps(options.stats ? timedCompose : baseCompose);
    compose.end = () => { ended = true; return assignProps({}); };
    return { compose, config: props.config };

};
