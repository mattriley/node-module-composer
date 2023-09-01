const Session = require('./session');
const util = require('./util');

module.exports = (target, options = {}) => {

    const configure = (configs = [], customiser) => {
        return createComposer(configs.reduce((acc, c) => util.mergeWith(acc, util.invokeOrReturn(c, acc), customiser), {}));
    };

    const createComposer = (config = {}) => {
        const session = Session(target, options, config);
        const make = (path, deps, opts) => session.external.compose(path, deps, opts);
        const deep = (path, deps, opts) => make(path, deps, { ...opts, depth: Infinity });
        const asis = (path, opts) => make(path, null, opts);
        const end = () => session.external;
        const compose = Object.assign(make, session.external, { make, deep, asis, end });
        return { compose, configure, ...session.configAliases };
    };

    return configure(options.config);

};
