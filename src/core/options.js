const DefaultOptions = require('./default-options');
const util = require('./util');

module.exports = userOptions => {

    const defaultOptions = DefaultOptions();
    const optionSources = { defaultOptions, userOptions };
    const globalOptions = Object.assign({}, ...Object.values(optionSources));

    const getModuleOptions = (path, moduleOptions) => {
        const overrides = moduleOptions.overrides ? util.set(util.cloneDeep(globalOptions.overrides), path, moduleOptions.overrides) : globalOptions.overrides;
        return { ...globalOptions, ...moduleOptions, overrides };
    };

    return { optionSources, globalOptions, getModuleOptions };

};
