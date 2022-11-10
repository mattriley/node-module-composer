const Compose = require('./compose');
const Options = require('./options');
const extensions = require('./extensions');
const util = require('./util');

module.exports = (target, userOptions = {}) => {

    if (!util.isPlainObject(target)) throw new Error('target must be a plain object');

    const targetModules = util.pickBy(target, util.isPlainObject);
    const defaultOptions = Options();
    const options = util.merge({}, defaultOptions, userOptions);
    const config = util.mergeValues({}, options, options.configOptionKeys);
    const maybeConfig = Object.keys(config).length ? { config } : {};

    const state = {
        ended: false,
        dependencies: util.mapValues(targetModules, () => []),
        composedDependencies: {},
        modules: { ...maybeConfig, ...targetModules },
        extensions: {}
    };

    const constants = { defaultOptions, userOptions, options, config, target, targetModules };
    const session = { external: { ...state, ...constants }, state, ...constants };
    const { compose, ...functions } = extensions.setup(session, Compose(session));

    const registerModule = (path, module, deps) => {
        util.set(state.modules, path, module);
        const depKeys = Object.keys(deps).filter(k => k !== path);
        state.dependencies[path] = state.composedDependencies[path] = depKeys;
        return state.modules;
    };

    Object.assign(session.external, functions);
    return Object.assign(session, { compose, registerModule });

}; 
