const Options = require('./Options');
const extensions = require('./extensions');
const util = require('./util');

module.exports = (target, userOptions = {}) => {

    if (!util.isPlainObject(target)) throw new Error('target must be a plain object');

    const targetModules = util.pickBy(target, util.isPlainObject);
    const defaultOptions = Options();
    const options = util.merge({}, defaultOptions, userOptions);
    const config = util.mergeValues({}, options, options.configOptionKeys);

    const maybeConfig = Object.keys(config).length ? { config } : {};

    const primitiveState = {
        ended: false,
        dependencies: util.mapValues(targetModules, () => []),
        composedDependencies: {}
    };

    const state = {
        ...primitiveState,
        modules: { ...maybeConfig, ...targetModules }
    };

    const constants = { defaultOptions, userOptions, options, target, config };
    const session = { state, targetModules, ...constants };

    const extensionEntries = extensions.sessionExtensions().flatMap(ext => {
        return Object.entries(ext.session).map(([name, func]) => [name, func(session)]);
    });

    const functions = Object.fromEntries(extensionEntries);

    const mutations = {
        registerModule: (path, module, deps) => {
            util.set(state.modules, path, module);
            const depKeys = Object.keys(deps).filter(k => k !== path);
            state.dependencies[path] = state.composedDependencies[path] = depKeys;
            return state.modules;
        }
    };

    const external = { ...constants, ...state, ...functions };
    Object.assign(session, { external, ...mutations });
    return session;

}; 
