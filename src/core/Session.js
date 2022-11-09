const Compose = require('./Compose');
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
        modules: { ...maybeConfig, ...targetModules },
        stats: {},
        extensions: {}
    };

    const constants = { defaultOptions, userOptions, options, target, config };
    const external = { ...constants, ...state };
    const session = { external, state, targetModules, ...constants };

    const { compose, ...functions } = Object.entries(extensions.get()).reduce((acc, [name, ext]) => {
        const getState = () => state.extensions[name];
        const setState = s => util.set(state.extensions, name, s);
        const _session = { ...session, getState, setState };

        const { compose, ...functions } = Object.fromEntries(Object.entries(ext).map(([name, func]) => {
            return [name, func(_session)];
        }));

        if (compose) acc.compose = compose(acc.compose);
        return { ...acc, ...functions };
    }, { compose: Compose(session) });

    session.compose = compose;

    const mutations = {
        registerModule: (path, module, deps) => {
            util.set(state.modules, path, module);
            const depKeys = Object.keys(deps).filter(k => k !== path);
            state.dependencies[path] = state.composedDependencies[path] = depKeys;
            return state.modules;
        }
    };

    Object.assign(external, functions);
    Object.assign(session, mutations);
    return session;

}; 
