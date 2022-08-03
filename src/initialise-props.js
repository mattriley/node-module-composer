const util = require('./util');
const eject = require('./eject');
const mermaid = require('./mermaid');
const defaultOptions = require('./default-options');

module.exports = (target, userOptions) => {

    const options = util.merge({}, defaultOptions, userOptions);
    const config = util.mergeValues({}, options, options.configKeys);
    const stats = { durationUnit: 'ms', totalDuration: 0, modules: {} };
    const optionalStats = options.stats ? { stats } : {};

    const props = {
        compositionName: userOptions.compositionName,
        defaultOptions, userOptions, options, config, target,
        modules: { ...target },
        dependencies: util.mapValues(target, () => []),
        composedDependencies: {},
        ...optionalStats,
        mermaid: opts => mermaid(props.dependencies, opts),
        eject: () => eject(target, props.composedDependencies)
    };

    return { ...props, props };

};
