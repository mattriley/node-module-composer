const Options = require('./options');
const extensions = require('./extensions');
const _ = require('./util');

module.exports = (target, options = {}, config = {}) => {

    if (!_.isPlainObject(target)) throw new Error('target must be a plain object');

    const targetModules = _.pickBy(target, _.isPlainObject);
    const { globalOptions, getComposeOptions } = Options(options);

    const state = {
        dependencies: _.mapValues(targetModules, () => []),
        composedDependencies: {},
        modules: { ...targetModules },
        extensions: {}
    };

    const registerModule = (path, module, deps) => {
        _.set(state.modules, path, module);
        const depKeys = Object.keys(deps ?? {}).filter(k => k !== path);
        state.dependencies[path] = state.composedDependencies[path] = depKeys;
        return state.modules;
    };

    const registerAlias = (path, module) => {
        _.set(state.modules, path, module);
        return state.modules;
    };

    config = globalOptions.freezeConfig ? _.deepFreeze(config) : config;
    const configAliases = globalOptions.configAlias.reduce((acc, alias) => Object.assign(acc, { [alias]: config }), { config });
    const external = { ...state, globalOptions, target, targetModules, config };
    const session = { ...external, external, configAliases, getComposeOptions, registerModule, registerAlias };
    const { precomposers, postcomposers, ...extensionFunctions } = extensions.setup(session);
    Object.assign(session, { precomposers, postcomposers });
    Object.assign(session.external, extensionFunctions);
    Object.assign(state.modules, { ...configAliases, ...state.modules });
    if (globalOptions.compositionModule) Object.assign(state.modules, { composition: session.external });
    return session;

}; 
