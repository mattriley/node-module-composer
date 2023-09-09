const DefaultOptions = require('./default-options');
const _ = require('./util');

module.exports = opts => {

    const defaults = DefaultOptions();
    const globalOptions = { ...defaults.composer.core, ...defaults.composer.extensions, ...opts };

    const getModuleOptions = (path, opts) => {
        return {
            ...globalOptions,
            ...defaults.compose.core,
            ...defaults.compose.extensions,
            ...opts,
            customiser: opts.customiser ?? defaults.compose.customiser ?? globalOptions.customiser,
            overrides: opts.overrides ? _.set(_.cloneDeep(globalOptions.overrides), path, opts.overrides) : globalOptions.overrides
        };
    };

    return { globalOptions, getModuleOptions };

};
