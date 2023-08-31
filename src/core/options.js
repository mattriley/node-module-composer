const DefaultOptions = require('./default-options');
const util = require('./util');

module.exports = userOptions => {

    const defaultOptions = DefaultOptions();
    const sources = { defaultOptions, userOptions };
    const composerOptions = Object.assign({}, ...Object.values(sources));

    const getModuleOptions = (path, moduleOptions) => {
        const overrides = moduleOptions.overrides ? util.set(util.cloneDeep(composerOptions.overrides), path, moduleOptions.overrides) : composerOptions.overrides;
        return { ...composerOptions, ...moduleOptions, overrides };
    };

    return { sources, composerOptions, getModuleOptions };

};
