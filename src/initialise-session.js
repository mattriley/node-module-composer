const util = require('./util');
const eject = require('./eject');
const mermaid = require('./mermaid');
const defaultOptions = require('./default-options');

module.exports = (target, userOptions = {}) => {

    if (!util.isPlainObject(target)) throw new Error('target must be a plain object');

    const targetModules = util.pickBy(target, util.isPlainObject);
    const options = util.merge({}, defaultOptions, userOptions);
    const config = util.mergeValues({}, options, options.configKeys);

    const stats = { durationUnit: 'ms', totalDuration: 0, modules: {} };
    const maybeStats = options.stats ? { stats } : {};
    const maybeConfig = Object.keys(config).length ? { config } : {};

    const state = {
        ended: false,
        modules: { ...maybeConfig, ...targetModules },
        dependencies: util.mapValues(targetModules, () => []),
        composedDependencies: {},
        ...maybeStats
    };

    const constants = {
        compositionName: options.compositionName,
        defaultOptions, userOptions, options,
        target, config
    };

    const functions = {
        mermaid: opts => mermaid(state.dependencies, opts),
        eject: () => eject(targetModules, state.composedDependencies)
    };

    const mutations = {
        registerModule: (key, module, deps) => {
            util.set(state.modules, key, module);
            const depKeys = Object.keys(deps).filter(k => k !== key);
            state.dependencies[key] = state.composedDependencies[key] = depKeys;
            return state.modules;
        }
    };

    const external = { ...constants, ...state, ...functions };
    return { external, state, ...constants, ...mutations };

};
