const Session = require('./session');
const Configure = require('./configure');
const util = require('./util');

const composer = (target, options = {}) => {

    const createComposer = (config = {}) => {
        const session = Session(target, options, config);
        const make = (path, deps, opts) => session.compose(path, deps, opts);
        const deep = (path, deps, opts) => make(path, deps, { ...opts, depth: Infinity });
        const asis = (path, opts) => make(path, null, opts);

        const flat = (path, deps, opts) => {
            const modules = util.get(session.target, path);
            const results = Object.keys(modules).map(key => util.get(session.compose(`${path}.${key}`, deps, opts), `${path}.${key}`));
            return util.set({}, path, Object.assign({}, ...results));
        };

        module.exports = { flat };

        const compose = Object.assign(make, session.external, { session: session.external }, { make, deep, flat, asis });
        return { compose, configure, ...session.configAliases };
    };

    const configure = Configure(createComposer, options.defaultConfig, options.config);
    return configure();

};

const configure = Configure();
module.exports = Object.assign(composer, { composer, configure });
