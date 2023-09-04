const Session = require('./session');
const Configure = require('./configure');

module.exports = (target, options = {}) => {

    const createComposer = (config = {}) => {
        const session = Session(target, options, config);
        const make = (path, deps, opts) => session.external.compose(path, deps, opts);
        const deep = (path, deps, opts) => make(path, deps, { ...opts, depth: Infinity });
        const asis = (path, opts) => make(path, null, opts);
        const done = () => session.external;
        const compose = Object.assign(make, session.external, { make, deep, asis, done });
        return { compose, configure, ...session.configAliases };
    };

    const configure = Configure(createComposer, options.defaultConfig, options.config);
    return configure();

};
