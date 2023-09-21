const constants = require('./constants');
const _ = require('./util');

const applyArrayOptions = (obj, ...keys) => {
    return { ...obj, ...Object.fromEntries(keys.map(key => [key, [obj[key] ?? []].flat()])) };
};

const validate = (opts, defaults) => {
    const invalid = Object.keys(opts).filter(opt => Object.keys(defaults).indexOf(opt) === -1);
    if (invalid.length) throw new Error(`Invalid option: ${invalid.join(', ')}`);
};

module.exports = opts => {
    validate(opts, constants.composerDefaultOptions);
    const composerOptions = _.flow([
        opts => Object.assign({}, constants.composerDefaultOptions, opts),
        opts => applyArrayOptions(opts, 'configAlias')
    ])(opts);

    const getComposeOptions = (key, opts) => {
        validate(opts, constants.composeDefaultOptions);
        const overrides = opts.overrides ? _.set(_.cloneDeep(composerOptions.overrides), key, opts.overrides) : composerOptions.overrides;
        const composeOptions = _.flow([
            opts => Object.assign({}, composerOptions, composerOptions.defaults[key], opts),
            opts => applyArrayOptions(opts, 'moduleAlias', 'functionAlias'),
            opts => {
                return { ...opts, overrides };
            }
        ])(opts);
        return composeOptions;
    };

    return { composerOptions, getComposeOptions };

};
