const Configure = require('./configure');
const Session = require('./session');
const util = require('./util');

module.exports = (target, clientOptions = {}) => {

    const createComposer = (config = {}) => {
        const session = Session(target, config, clientOptions);

        const makeComposeFunction = () => (path, deps = {}, opts = {}) => {
            if (session.state.ended) throw new Error('Composition has ended');
            return session.compose(path, deps, opts);
        };

        const compose = makeComposeFunction();
        const make = makeComposeFunction();

        const deep = (path, deps = {}, opts = {}) => {
            const optsMod = util.merge({ depth: Infinity }, opts);
            return compose(path, deps, optsMod);
        };

        const flat = (path, deps = {}, opts = {}) => {
            const modules = util.get(target, path);
            const results = Object.keys(modules).map(key => util.get(compose(`${path}.${key}`, deps, opts), `${path}.${key}`));
            return util.set({}, path, Object.assign({}, ...results));
        };

        const asis = (path, opts = {}) => {
            return compose(path, null, opts);
        };

        const end = () => {
            if (session.state.ended) throw new Error('Composition has already ended');
            session.state.ended = true;
            return session.external;
        };

        Object.assign(compose, session.external, { make, deep, flat, asis, end });
        return { compose, configure, ...session.configAliases };
    };

    const configure = Configure(createComposer);
    return configure(clientOptions.config);

};
