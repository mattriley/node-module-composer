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
    const external = { ...state, ...options.sources, composerOptions, target, targetModules, ...configAliases };
    const internal = { ...state, ...options, configAliases, registerModule, registerAlias, ...external, external };
    const compose = Compose(internal);
    const { precomposers, postcomposers, ...functions } = extensions.setup({ ...internal, compose });

    Object.assign(external, functions);
    Object.assign(internal, { compose, precomposers, postcomposers });

    return { internal, external };

}; 
