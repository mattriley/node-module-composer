const DefaultOptions = require('./default-options');
const _ = require('./util');

module.exports = opts => {

    const defaults = DefaultOptions();
    const globalOptions = { ...defaults.core, ...defaults.extensions, ...opts };

    const getModuleOptions = (path, opts) => {
        return {
            ...globalOptions, ...opts,
            moduleAlias: opts.moduleAlias ?? globalOptions.moduleAlias[path],
            overrides: opts.overrides ? _.set(_.cloneDeep(globalOptions.overrides), path, opts.overrides) : globalOptions.overrides
        };
    };

    return { globalOptions, getModuleOptions };

};
