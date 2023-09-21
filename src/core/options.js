const constants = require('./constants');
const _ = require('./util');

const applyArrayOptions = (...keys) => opts => {
    return Object.fromEntries(keys.map(key => [key, [opts[key] ?? []].flat()]));
};

const validate = (opts, defaults) => {
    const invalid = Object.keys(opts).filter(opt => Object.keys(defaults).indexOf(opt) === -1);
    if (invalid.length) throw new Error(`Invalid option: ${invalid.join(', ')}`);
};

module.exports = opts => {
    validate(opts, constants.composerDefaultOptions);
    const composerOptions = _.pipeAssign(
        constants.composerDefaultOptions,
        opts,
        applyArrayOptions('configAlias')
    );

    const getComposeOptions = (key, opts) => {
        validate(opts, constants.composeDefaultOptions);
        const composeOptions = _.pipeAssign(
            opts,
            { overrides: opts.overrides ?? composerOptions.overrides[key] },
            opts => ({ ...composerOptions, ...composerOptions.defaults[key], ...opts }),
            applyArrayOptions('moduleAlias', 'functionAlias')
        );
        return composeOptions;
    };

    return { composerOptions, getComposeOptions };

};
