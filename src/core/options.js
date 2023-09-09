const constants = require('./constants');
const _ = require('./util');

module.exports = opts => {
    const invalidOpts = Object.keys(opts).filter(opt => constants.composerOptions.indexOf(opt) === -1);
    if (invalidOpts.length) throw new Error(`Invalid option: ${invalidOpts.join(', ')}`);

    const globalOptions = { ...constants.defaultOptions, ...opts };

    const getModuleOptions = (path, opts) => {
        const invalidOpts = Object.keys(opts).filter(opt => constants.composeOptions.indexOf(opt) === -1);
        if (invalidOpts.length) throw new Error(`Invalid option: ${invalidOpts.join(', ')}`);

        return {
            ...globalOptions, ...opts,
            moduleAlias: opts.moduleAlias ?? globalOptions.moduleAlias[path],
            overrides: opts.overrides ? _.set(_.cloneDeep(globalOptions.overrides), path, opts.overrides) : globalOptions.overrides
        };
    };

    return { globalOptions, getModuleOptions };

};
