const constants = require('./constants');
const _ = require('./util');

const validate = (opts, defaults) => {
    const invalid = Object.keys(opts).filter(opt => Object.keys(defaults).indexOf(opt) === -1);
    if (invalid.length) throw new Error(`Invalid option: ${invalid.join(', ')}`);
};

module.exports = opts => {
    validate(opts, constants.composerDefaultOptions);
    const composerOptions = { ...constants.composerDefaultOptions, ...opts };

    const getComposeOptions = (path, opts) => {
        validate(opts, constants.composeDefaultOptions);

        return {
            ...composerOptions, ...opts,
            moduleAlias: opts.moduleAlias ?? composerOptions.moduleAlias[path],
            overrides: opts.overrides ? _.set(_.cloneDeep(composerOptions.overrides), path, opts.overrides) : composerOptions.overrides
        };
    };

    return { composerOptions, getComposeOptions };

};
