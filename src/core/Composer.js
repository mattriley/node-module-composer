const Session = require('./session');
const util = require('./util');

module.exports = (target, options = {}) => {

    const configure = (configs = [], customiser) => {
        const config = configs.reduce((acc, c) => {
            const config = util.isPlainFunction(c) ? c(acc) : c;
            return util.mergeWith(acc, config, customiser);
        }, {});
        return createComposer(config);
    };

    const createComposer = (config = {}) => {
        const session = Session(target, options, config);

        const make = (path, deps, opts) => session.external.compose(path, deps, opts);
        const deep = (path, deps, opts) => make(path, deps, { ...opts, depth: Infinity });
        const asis = (path, opts) => make(path, null, opts);

        const end = () => {
            return session.external;
        };

        const compose = Object.assign(make, session.external, { make, deep, asis, end });
        return { compose, configure, ...session.configAliases };
    };

    return configure(options.config);

};
