const Options = require('./Options');
const extensions = require('./extensions');
const util = require('./util');

const isNode = globalThis.process?.release?.name === 'node';

const readPackageName = () => {
    try {
        return require(globalThis.process.cwd() + '/package.json').name;
    } catch (ex) {
        return undefined;
    }
};

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
        composedDependencies: {},
        stats: { durationUnit: 'ms', totalDuration: 0, modules: {} }
    };

    const state = {
        ...primitiveState,
        modules: { ...maybeConfig, ...targetModules }
    };

    const compositionName = util.merge(
        { compositionName: isNode ? readPackageName() : undefined },
        { compositionName: options.compositionNameConfigKeys.map(key => config[key]).find(val => !!val) },
        { compositionName: options.compositionName }
    );

    const constants = { ...compositionName, defaultOptions, userOptions, options, target, config };
    const session = { state, targetModules, ...constants };

    const extensionEntries = extensions.sessionExtensions().flatMap(ext => {
        return Object.entries(ext.session).map(([name, func]) => {
            return [name, func(session)];
        });
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
