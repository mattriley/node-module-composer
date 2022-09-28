const util = require('./util');
const composers = require('./composers');
const initialiseSession = require('./initialise-session');

module.exports = (target, userOptions = {}) => {

    const session = initialiseSession(target, userOptions);

    const baseCompose = composers.base(session);
    const timeCompose = composers.time(session, baseCompose);
    const composeFunc = session.options.stats ? timeCompose : baseCompose;

    const end = () => {
        if (session.state.ended) throw new Error('Composition has already ended');
        session.state.ended = true;
        return session.external;
    };

    const compose = (path, deps = {}, args = {}, opts = {}) => {
        if (session.state.ended) throw new Error('Composition has ended');
        return composeFunc(path, deps, args, opts);
    };

    compose.deep = (path, deps = {}, args = {}, opts = {}) => {
        const optsMod = util.merge({ depth: Infinity }, opts);
        return compose(path, deps, args, optsMod);
    };

    if (!globalThis.compositions) globalThis.compositions = [];
    globalThis.compositions.push(session.external);

    Object.assign(compose, session.external, { end });
    return { compose, config: session.external.config };

};
