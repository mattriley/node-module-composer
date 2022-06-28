const util = require('./util');
const eject = require('./eject');
const mermaid = require('./mermaid');
const timedCompose = require('./timed-compose');
const defaultOptions = require('./default-options');

module.exports = (target, userOptions = {}) => {

    let ended = false;
    const options = util.merge({}, defaultOptions, userOptions);
    const config = util.mergeValues({}, options, options.configKeys);

    const props = {
        defaultOptions, userOptions, options, config, target,
        modules: { ...target },
        dependencies: util.mapValues(target, () => []),
        composedDependencies: {},
        stats: { totalDuration: 0, modules: {} },
        mermaid: opts => mermaid(props.dependencies, opts),
        eject: () => eject(target, props.composedDependencies)
    };

    const baseCompose = (key, deps = {}) => {
        if (ended) throw new Error('Composition has ended');
        if (!key) throw new Error('key is required');
        if (!util.has(target, key)) throw new Error(`${key} not found`);
        if (props.composedDependencies[key]) throw new Error(`${key} already composed`);
        deps = { ...options.defaults, ...deps };
        const recursed = recurse(util.get(target, key), key, deps);
        const customised = util.invoke(recursed, options.customiser, recursed) ?? recursed;
        const overridden = util.merge({}, customised, util.get(options.overrides, key));
        util.set(props.modules, key, overridden);
        props.dependencies[key] = props.composedDependencies[key] = Object.keys(deps);
        return props.modules;
    };

    const recurse = (target, parentKey, deps) => {
        if (!util.isPlainObject(target)) return target;
        const product = {};
        deps = util.set({ ...deps }, parentKey, product);
        const evaluate = (val, key) => util.isPlainFunction(val) ? val(deps) : recurse(val, key, deps);
        return Object.assign(product, util.mapValues(target, evaluate));
    };

    const end = () => { ended = true; return props; };
    const compose = options.stats ? timedCompose(baseCompose, props.stats) : baseCompose;
    Object.assign(compose, props, { end });
    return { compose, config };

};
