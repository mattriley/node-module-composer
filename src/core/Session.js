const Compose = require('./compose');
const Options = require('./options');
const extensions = require('./extensions');
const util = require('./util');

module.exports = (target, config = {}, clientOptions = {}) => {

    if (!util.isPlainObject(target)) throw new Error('target must be a plain object');

    const targetModules = util.pickBy(target, util.isPlainObject);
    const options = Options(clientOptions);
    const { composerOptions } = options;

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

    const frozenConfig = composerOptions.freezeConfig ? util.deepFreeze(config) : config;
    const configAliases = { config: frozenConfig, [composerOptions.configAlias]: frozenConfig };
    const external = { ...options.sources, composerOptions, target, targetModules, ...configAliases };
    const session = { external: { ...state, ...external }, ...options, state, configAliases, registerModule, registerAlias, ...external };
    const compose = Compose(session);
    const { precomposers, postcomposers, ...functions } = extensions.setup({ ...session, compose });

    Object.assign(session.external, functions);
    return Object.assign(session, { compose, precomposers, postcomposers });

}; 
