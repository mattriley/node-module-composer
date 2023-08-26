const Configure = require('./configure');
const Session = require('./session');
const util = require('./util');

module.exports = (target, clientOptions = {}) => {

    const createComposer = (config = {}) => {
        const session = Session(target, config, clientOptions);

        const make = opts => (path, deps = {}) => {
            if (session.state.ended) throw new Error('Composition has ended');
            return session.compose(path, deps, opts);
        };

        const deep = opts => (path, deps = {}) => {
            return make(util.merge({ depth: Infinity }, opts))(path, deps);
        };

        const flat = opts => (path, deps = {}) => {
            const modules = util.get(target, path);
            const results = Object.keys(modules).map(key => util.get(make(opts)(`${path}.${key}`, deps), `${path}.${key}`));
            return util.set({}, path, Object.assign({}, ...results));
        };

        const asis = opts => path => {
            return make(opts)(path, null);
        };

        const modes = { make, deep, flat, asis };
        const applyModes = opts => Object.assign({}, ...Object.entries(modes).map(([name, func]) => ({ [name]: func(opts) })));

        const opts = opts => {
            return Object.assign(make(opts), session.external, { end }, applyModes(opts));
        };

        const end = () => {
            if (session.state.ended) throw new Error('Composition has already ended');
            session.state.ended = true;
            return session.external;
        };

        const compose = Object.assign(make(), session.external, { opts, end }, applyModes());
        return { compose, configure, ...session.configAliases };
    };

    const configure = Configure(createComposer);
    return configure(clientOptions.config);

};
