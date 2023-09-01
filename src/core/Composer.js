const Configure = require('./configure');
const Session = require('./session');

module.exports = (target, options = {}) => {

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

    const configure = Configure(createComposer);
    return configure(options.config);

};
