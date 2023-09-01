const DefaultOptions = require('./default-options');
const _ = require('./util');

module.exports = userOptions => {

    const defaultOptions = DefaultOptions();
    const optionSources = { defaultOptions, userOptions };
    const globalOptions = Object.assign({}, ...Object.values(optionSources));

    const getModuleOptions = (path, moduleOptions) => {
        const overrides = moduleOptions.overrides ? _.set(_.cloneDeep(globalOptions.overrides), path, moduleOptions.overrides) : globalOptions.overrides;
        return { ...globalOptions, ...moduleOptions, overrides };
    };

    return { optionSources, globalOptions, getModuleOptions };

};
