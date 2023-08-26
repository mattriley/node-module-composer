const Compose = require('./compose');
const Options = require('./options');
const extensions = require('./extensions');
const util = require('./util');

module.exports = (target, config = {}, clientOptions = {}) => {

    if (!util.isPlainObject(target)) throw new Error('target must be a plain object');

    const targetModules = util.pickBy(target, util.isPlainObject);
    const defaultOptions = Options();
    const options = { ...defaultOptions, ...clientOptions };

    const state = {
        ended: false,
        dependencies: util.mapValues(targetModules, () => []),
        composedDependencies: {},
        modules: { ...targetModules },
        extensions: {}
    };

    const frozenConfig = options.freezeConfig ? util.deepFreeze(config) : config;
    const configAliases = { config: frozenConfig, [options.configAlias]: frozenConfig };
    const external = { defaultOptions, clientOptions, options, target, targetModules, ...configAliases };
    const session = { external: { ...state, ...external }, state, configAliases, ...external };
    const { compose, precomposers, postcomposers, ...functions } = extensions.setup(session, Compose(session));

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

    Object.assign(session.external, functions);
    return Object.assign(session, { compose, registerModule, registerAlias, precomposers, postcomposers });

}; 
