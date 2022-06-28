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
    const config = util.mergeConfig(options, options.configKeys);

    const props = {
        defaultOptions, userOptions, options, config, target,
        modules: { ...target },
        dependencies: util.mapValues(target, () => []),
        composedDependencies: {},
        stats: { totalDuration: 0, modules: {} },
        mermaid: opts => mermaid(props.dependencies, opts),
        eject: () => eject(target, props.composedDependencies)
    };

    const recurse = (target, parentKey, [deps, ...args]) => {
        if (!util.isPlainObject(target)) return target;
        const product = {};
        const newModulesArgs = { ...deps };
        util.set(newModulesArgs, parentKey, product);
        const newArgs = [newModulesArgs, ...args];
        const evaluate = (val, key) => util.isPlainFunction(val) ? val(...newArgs) : recurse(val, key, newArgs);
        const newObj = util.mapValues(target, evaluate);
        return Object.assign(product, newObj);
    };

    const baseCompose = (key, deps = {}, ...args) => {
        if (ended) throw new Error('Composition has ended');
        if (!key) throw new Error('key is required');
        if (!util.has(target, key)) throw new Error(`${key} not found`);
        if (props.composedDependencies[key]) throw new Error(`${key} already composed`);
        deps = { ...options.defaults, ...deps };
        const intermediate = recurse(util.get(target, key), key, [deps, ...args]) ?? {};
        const module = options.customiser(intermediate);
        util.set(props.modules, key, util.override({ [key]: module }, options.overrides)[key]);
        props.dependencies[key] = props.composedDependencies[key] = Object.keys(deps);
        return props.modules;
    };

    const timedCompose = (key, deps = {}, ...args) => {
        const startTime = performance.now();
        const result = baseCompose(key, deps, ...args);
        const duration = performance.now() - startTime;
        util.set(props.stats.modules, [key, 'duration'], duration);
        props.stats.totalDuration += duration;
        return result;
    };

    const end = () => { ended = true; return props; };
    const compose = options.stats ? timedCompose : baseCompose;
    Object.assign(compose, props, { end });
    return { compose, config };

};
