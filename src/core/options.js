const DefaultOptions = require('./default-options');
const _ = require('./util');

const recognisedComposeOpts = ['customiser', 'depth', 'flat', 'overrides', 'functionAlias', 'moduleAlias', 'privatePrefix', 'publicPrefix'];

module.exports = opts => {

    const defaults = DefaultOptions();
    const globalOptions = { ...defaults.core, ...defaults.extensions, ...opts };

    const getModuleOptions = (path, opts) => {
        const invalidOpts = Object.keys(opts).filter(opt => recognisedComposeOpts.indexOf(opt) === -1);
        if (invalidOpts.length) throw new Error(`Invalid option(s): ${invalidOpts.join(', ')}`);

        return {
            ...globalOptions, ...opts,
            moduleAlias: opts.moduleAlias ?? globalOptions.moduleAlias[path],
            overrides: opts.overrides ? _.set(_.cloneDeep(globalOptions.overrides), path, opts.overrides) : globalOptions.overrides
        };
    };

    return { globalOptions, getModuleOptions };

};
