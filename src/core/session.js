const Compose = require('./compose');
const DefaultOptions = require('./default-options');
const extensions = require('./extensions');
const util = require('./util');

module.exports = (target, config = {}, clientOptions = {}) => {

    if (!util.isPlainObject(target)) throw new Error('target must be a plain object');

    const targetModules = util.pickBy(target, util.isPlainObject);
    const defaultOptions = DefaultOptions();
    const options = { ...defaultOptions, ...clientOptions };

    const state = {
        ended: false,
        dependencies: util.mapValues(targetModules, () => []),
        composedDependencies: {},
        modules: { ...targetModules },
        extensions: {}
    };

    const registerModule = (path, module, deps) => {
        util.set(state.modules, path, module);
        const depKeys = Object.keys(deps ?? {}).filter(k => k !== path);
        state.dependencies[path] = state.composedDependencies[path] = depKeys;
        return state.modules;
    };

    const registerAlias = (path, module) => {
        util.set(state.modules, path, module);
        return state.modules;
    };

    const frozenConfig = options.freezeConfig ? util.deepFreeze(config) : config;
    const configAliases = { config: frozenConfig, [options.configAlias]: frozenConfig };
    const external = { defaultOptions, clientOptions, options, target, targetModules, ...configAliases };
    const session = { external: { ...state, ...external }, state, configAliases, registerModule, registerAlias, ...external };
    const compose = Compose(session);
    const { precomposers, postcomposers, ...functions } = extensions.setup({ ...session, compose });

    Object.assign(session.external, functions);
    return Object.assign(session, { compose, precomposers, postcomposers });

}; 
