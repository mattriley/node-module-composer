const util = require('./util');

module.exports = (targetModules, config) => {

    const maybeConfig = Object.keys(config).length ? { config } : {};

    const state = {
        modules: { ...maybeConfig, ...targetModules },
        dependencies: util.mapValues(targetModules, () => []),
        composedDependencies: {},
        registerModule: (key, module, deps) => {
            util.set(state.modules, key, module);
            const depKeys = Object.keys(deps).filter(k => k !== key);
            state.dependencies[key] = state.composedDependencies[key] = depKeys;
        }
    };

    return state;

};
