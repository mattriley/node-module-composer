const Compose = require('./Compose');
const Session = require('./Session');
const extensions = require('./extensions');
const util = require('./util');

module.exports = (target, userOptions = {}) => {

    const session = Session(target, userOptions);

    const composeImpl = extensions.state.compose.reduce((compose, ext) => {
        return ext.compose(compose, session);
    }, Compose(session));

    const end = () => {
        if (session.state.ended) throw new Error('Composition has already ended');
        session.state.ended = true;
        return session.external;
    };

    const compose = (path, deps = {}, args = {}, opts = {}) => {
        if (session.state.ended) throw new Error('Composition has ended');
        return composeImpl(path, deps, args, opts);
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
