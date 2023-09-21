const constants = require('./constants');
const _ = require('./util');

const applyArrayOptions = (...keys) => opts => {
    return Object.fromEntries(keys.map(key => [key, [opts[key] ?? []].flat()]));
};

const validate = defaults => opts => {
    const invalid = Object.keys(opts).filter(opt => Object.keys(defaults).indexOf(opt) === -1);
    if (invalid.length) throw new Error(`Invalid option: ${invalid.join(', ')}`);
};

module.exports = opts => {
    const composerOptions = _.pipeAssign(
        opts,
        validate(constants.composerDefaultOptions),
        opts => ({ ...constants.composerDefaultOptions, ...opts }),
        applyArrayOptions('configAlias')
    );
    const getComposeOptions = (key, opts) => {
        return _.pipeAssign(
            opts,
            validate(constants.composeDefaultOptions),
            { overrides: opts.overrides ?? composerOptions.overrides[key] },
            opts => ({ ...composerOptions, ...composerOptions.defaults[key], ...opts }),
            applyArrayOptions('moduleAlias', 'functionAlias')
        );
    };
    return { composerOptions, getComposeOptions };
};
