const Session = require('./session');
const util = require('./util');

module.exports = (target, userOptions = {}, globalThisOverride = globalThis) => {

    const session = Session(target, userOptions, globalThisOverride);

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
    return { compose, config: session.external.config };

};
