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
        ...maybeStats
    };

    return state;

};
