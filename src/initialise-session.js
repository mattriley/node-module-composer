const util = require('./util');
const eject = require('./eject');
const mermaid = require('./mermaid');
const defaultOptions = require('./default-options');

const isNode = globalThis.process?.release?.name === 'node';
const readPackageName = () => require(globalThis.process.cwd() + '/package.json').name;

module.exports = (target, userOptions = {}) => {

    if (!util.isPlainObject(target)) throw new Error('target must be a plain object');

    const targetModules = util.pickBy(target, util.isPlainObject);
    const options = util.merge({}, defaultOptions, userOptions);
    const config = util.mergeValues({}, options, options.configOptionKeys);

    const stats = { durationUnit: 'ms', totalDuration: 0, modules: {} };
    const maybeStats = options.stats ? { stats } : {};
    const maybeConfig = Object.keys(config).length ? { config } : {};

    const primitiveState = {
        ended: false,
        dependencies: util.mapValues(targetModules, () => []),
        composedDependencies: {},
        ...maybeStats
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

    const functions = {
        mermaid: opts => mermaid(state.dependencies, opts),
        eject: () => eject(targetModules, state.composedDependencies),
        json: () => JSON.stringify({ ...constants, ...primitiveState, mermaid: functions.mermaid() }, null, 4)
    };

    const mutations = {
        registerModule: (path, module, deps) => {
            util.set(state.modules, path, module);
            const depKeys = Object.keys(deps).filter(k => k !== path);
            state.dependencies[path] = state.composedDependencies[path] = depKeys;
            return state.modules;
        }
    };

    const external = { ...constants, ...state, ...functions };
    return { external, state, ...constants, ...mutations };

};
