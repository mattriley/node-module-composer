const Compose = require('./compose');
const Options = require('./options');
const extensions = require('./extensions');
const util = require('./util');

module.exports = (target, options = {}, config = {}) => {

    if (!util.isPlainObject(target)) throw new Error('target must be a plain object');

    const targetModules = util.pickBy(target, util.isPlainObject);
    const { optionSources, globalOptions, getModuleOptions } = Options(options);

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

    const frozenConfig = globalOptions.freezeConfig ? util.deepFreeze(config) : config;
    const configAliases = { config: frozenConfig, [globalOptions.configAlias]: frozenConfig };
    const external = { ...state, ...optionSources, globalOptions, target, targetModules, config: frozenConfig };
    const internal = { ...external, external, configAliases, getModuleOptions, registerModule, registerAlias };
    const compose = Compose(internal);
    const { precomposers, postcomposers, ...functions } = extensions.setup(internal);

    Object.assign(external, functions, { compose });
    Object.assign(internal, { precomposers, postcomposers });

    return internal;

}; 
