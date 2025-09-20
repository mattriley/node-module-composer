const Options = require('./options');
const extensions = require('./extensions');
const _ = require('./util');

module.exports = (target, options = {}, config = {}) => {

    if (!_.isPlainObject(target)) throw new Error('target must be a plain object');

    const targetModules = _.pickBy(target, _.isPlainObject);
    const { composerOptions, getComposeOptions } = Options(options);

    const state = {
        log: [],
        dependencies: {},
        modules: {},
        extensions: {}
    };

    const registerModule = ({ path, key, target, deps, options }) => {
        _.set(state.modules, key, target);
        const depKeys = Object.keys(deps ?? {}).filter(k => k !== key);
        state.dependencies[key] = depKeys;
        state.log.push({ path, key, depKeys, options });
        return state.modules;
    };

    const registerAlias = (key, module) => {
        _.set(state.modules, key, module);
        return state.modules;
    };

    config = composerOptions.freezeConfig ? _.deepFreeze(config) : config;
    const configAliases = composerOptions.configAlias.reduce((acc, alias) => Object.assign(acc, { [alias]: config }), { config });
    const external = { ...state, composerOptions, target, targetModules, ...configAliases };
    const session = { ...external, external, configAliases, getComposeOptions, registerModule, registerAlias };
    const { precomposers, postcomposers, ...extensionFunctions } = extensions.setup(session);
    Object.assign(session, { precomposers, postcomposers });
    Object.assign(session.external, extensionFunctions);
    Object.assign(state.modules, { ...configAliases, ...state.modules });
    if (composerOptions.compositionModule) Object.assign(state.modules, { composition: session.external });
    return session;

}; 
