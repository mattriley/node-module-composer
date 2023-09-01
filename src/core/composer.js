const Session = require('./session');
const _ = require('./util');

module.exports = (target, options = {}) => {

    const configure = (configs = [], customiser) => {
        return createComposer(configs.reduce((acc, c) => _.mergeWith(acc, _.invokeOrReturn(c, acc), customiser), {}));
    };

    const createComposer = (config = {}) => {
        const session = Session(target, options, config);
        const make = (path, deps, opts) => session.external.compose(path, deps, opts);
        const deep = (path, deps, opts) => make(path, deps, { ...opts, depth: Infinity });
        const asis = (path, opts) => make(path, null, opts);
        const done = () => session.external;
        const compose = Object.assign(make, session.external, { make, deep, asis, done });
        return { compose, configure, ...session.configAliases };
    };

    return configure(options.config);

};
