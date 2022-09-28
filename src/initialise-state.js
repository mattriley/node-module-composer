const util = require('./util');

module.exports = (targetModules, options, config) => {

    const stats = { durationUnit: 'ms', totalDuration: 0, modules: {} };
    const maybeStats = options.stats ? { stats } : {};
    const maybeConfig = Object.keys(config).length ? { config } : {};

    const state = {
        ended: false,
        modules: { ...maybeConfig, ...targetModules },
        dependencies: util.mapValues(targetModules, () => []),
        composedDependencies: {},
        ...maybeStats,
        registerModule: (key, module, deps) => {
            util.set(state.modules, key, module);
            const depKeys = Object.keys(deps).filter(k => k !== key);
            state.dependencies[key] = state.composedDependencies[key] = depKeys;
        }
    };

    return state;

};
