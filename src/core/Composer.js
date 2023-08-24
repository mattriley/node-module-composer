const Configure = require('./configure');
const Session = require('./session');
const util = require('./util');

module.exports = (target, clientOptions = {}) => {

    const createComposer = (config = {}) => {
        const session = Session(target, config, clientOptions);

        const asis = path => {
            return session.registerModule(path, util.get(target, path));
        };

        const deep = (path, deps = {}, args = {}, opts = {}) => {
            const optsMod = util.merge({ depth: Infinity }, opts);
            return compose(path, deps, args, optsMod);
        };

        const flat = (path, deps = {}, args = {}, opts = {}) => {
            const modules = util.get(target, path);
            const results = Object.keys(modules).map(key => util.get(compose(`${path}.${key}`, deps, args, opts), `${path}.${key}`));
            return util.set({}, path, Object.assign({}, ...results));
        };

        const end = () => {
            if (session.state.ended) throw new Error('Composition has already ended');
            session.state.ended = true;
            return session.external;
        };

        const compose = (path, deps = {}, args = {}, opts = {}) => {
            if (session.state.ended) throw new Error('Composition has ended');
            return session.compose(path, deps, args, opts);
        };

        Object.assign(compose, session.external, { asis, deep, flat, end });
        return { compose, configure, ...session.configAliases };
    };

    const configure = Configure(createComposer);
    return configure(clientOptions.config);

};
