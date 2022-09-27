const util = require('./util');
const eject = require('./eject');
const mermaid = require('./mermaid');
const defaultOptions = require('./default-options');

module.exports = (target, userOptions) => {

    const targetModules = util.pickBy(target, util.isPlainObject);
    const options = util.merge({}, defaultOptions, userOptions);
    const config = util.mergeValues({}, options, options.configKeys);
    const stats = { durationUnit: 'ms', totalDuration: 0, modules: {} };

    const maybeConfig = Object.keys(config).length ? { config } : {};
    const maybeStats = options.stats ? { stats } : {};

    const props = {
        compositionName: userOptions.compositionName,
        defaultOptions, userOptions, options, config, target,
        modules: { ...maybeConfig, ...targetModules },
        dependencies: util.mapValues(targetModules, () => []),
        composedDependencies: {},
        ...maybeStats,
        mermaid: opts => mermaid(props.dependencies, opts),
        eject: () => eject(targetModules, props.composedDependencies),
        registerModule: (key, module) => {
            util.set(props.modules, key, module);
        },
        registerDependencies: (key, deps) => {
            const depKeys = Object.keys(deps).filter(k => k !== key);
            props.dependencies[key] = props.composedDependencies[key] = depKeys;
        }
    };

    return { ...props, props };

};
