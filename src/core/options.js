const constants = require('./constants');
const _ = require('./util');

const getArrayOptions = (obj, ...keys) => Object.fromEntries(keys.map(key => [key, [obj[key] ?? []].flat()]));

const validate = (opts, defaults) => {
    const invalid = Object.keys(opts).filter(opt => Object.keys(defaults).indexOf(opt) === -1);
    if (invalid.length) throw new Error(`Invalid option: ${invalid.join(', ')}`);
};

module.exports = opts => {
    validate(opts, constants.composerDefaultOptions);
    const unprocessedComposerOptions = { ...constants.composerDefaultOptions, ...opts };
    const arrayOptions = getArrayOptions(unprocessedComposerOptions, 'configAlias');
    const composerOptions = {
        ...unprocessedComposerOptions,
        ...arrayOptions
    };

    const getComposeOptions = (path, opts) => {
        validate(opts, constants.composeDefaultOptions);
        const options = { ...composerOptions, ...composerOptions.defaults[path], ...opts };
        const arrayOptions = getArrayOptions(options, 'moduleAlias', 'functionAlias');
        const overrides = opts.overrides ? _.set(_.cloneDeep(composerOptions.overrides), path, options.overrides) : composerOptions.overrides;
        return { ...options, ...arrayOptions, overrides };
    };

    return { composerOptions, getComposeOptions };

};
