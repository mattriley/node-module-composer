const Session = require('./session');
const util = require('./util');

module.exports = (target, userOptions = {}) => {

    let session = Session(target, userOptions);

    const end = () => {
        if (session.state.ended) throw new Error('Composition has already ended');
        session.state.ended = true;
        return session.external;
    };

    const compose = (path, deps = {}, args = {}, opts = {}) => {
        if (session.state.ended) throw new Error('Composition has ended');
        return session.compose(path, deps, args, opts);
    };

    compose.deep = (path, deps = {}, args = {}, opts = {}) => {
        const optsMod = util.merge({ depth: Infinity }, opts);
        return compose(path, deps, args, optsMod);
    };

    Object.assign(compose, session.external, { end });

    // TODO: refactor
    const configure = (...configs) => {
        const config = configs.reduce((acc, x) => {
            const config = typeof x === 'function' ? x(acc) : x;
            return util.merge(acc, config);
        }, {});

        session = Session(target, { ...userOptions, config });
        Object.assign(compose, session.external, { end });
        return { compose, config: session.external.config, constants: session.external.config };
    };

    return { compose, configure, config: session.external.config, constants: session.external.config };

};
