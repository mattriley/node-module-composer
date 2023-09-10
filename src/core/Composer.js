const Session = require('./session');
const Compose = require('./compose');
const Configure = require('./configure');

const composer = (target, options = {}) => {

    const createComposer = (config = {}) => {
        const session = Session(target, options, config);
        const compose = Compose(session);
        const make = (path, deps, opts) => compose(path, deps, opts);
        const deep = (path, deps, opts) => make(path, deps, { ...opts, depth: Infinity });
        const flat = (path, deps, opts) => deep(path, deps, { ...opts, flat: true });
        const asis = (path, opts) => make(path, null, { ...opts, depth: 0 });
        const variations = { make, deep, flat, asis };
        Object.assign(compose, session.external, { session: session.external }, variations);
        return { compose, configure, ...session.configAliases };
    };

    const configure = Configure(createComposer, options.defaultConfig, options.config);
    return configure();

};

const configure = Configure();
module.exports = Object.assign(composer, { composer, configure });
