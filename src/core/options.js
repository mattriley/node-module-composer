const constants = require('./constants');
const _ = require('./util');

const array = val => [val ?? []].flat();

const validate = (opts, defaults) => {
    const invalid = Object.keys(opts).filter(opt => Object.keys(defaults).indexOf(opt) === -1);
    if (invalid.length) throw new Error(`Invalid option: ${invalid.join(', ')}`);
};

module.exports = opts => {
    validate(opts, constants.composerDefaultOptions);
    const unprocessedComposerOptions = { ...constants.composerDefaultOptions, ...opts };
    const composerOptions = {
        ...unprocessedComposerOptions,
        configAlias: array(unprocessedComposerOptions.configAlias)
    };

    const getComposeOptions = (path, opts) => {
        validate(opts, constants.composeDefaultOptions);
        const options = { ...composerOptions, ...composerOptions.defaults[path], ...opts };
        const moduleAlias = array(options.moduleAlias);
        const functionAlias = array(options.functionAlias);
        const overrides = opts.overrides ? _.set(_.cloneDeep(composerOptions.overrides), path, options.overrides) : composerOptions.overrides;
        return { ...options, overrides, moduleAlias, functionAlias };

    };

    return { composerOptions, getComposeOptions };

};
