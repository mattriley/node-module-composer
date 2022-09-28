const util = require('./util');
const eject = require('./eject');
const mermaid = require('./mermaid');
const defaultOptions = require('./default-options');
const initialiseState = require('./initialise-state');

module.exports = (target, userOptions) => {

    const targetModules = util.pickBy(target, util.isPlainObject);
    const options = util.merge({}, defaultOptions, userOptions);
    const config = util.mergeValues({}, options, options.configKeys);
    const stats = { durationUnit: 'ms', totalDuration: 0, modules: {} };
    const maybeStats = options.stats ? { stats } : {};

    const state = initialiseState(targetModules, config);

    const props = {
        compositionName: userOptions.compositionName,
        defaultOptions, userOptions, options, config, target,
        ...maybeStats,
        mermaid: opts => mermaid(props.dependencies, opts),
        eject: () => eject(targetModules, props.composedDependencies),
        state,
        ...state
    };

    return { ...props, props };

};
