const Configure = require('./configure');
const Session = require('./session');
const util = require('./util');

module.exports = (target, userOptions = {}) => {

    const createComposer = (config = {}) => {
        const constants = util.deepFreeze(config);
        const session = Session(target, constants, userOptions);

        const deep = (path, deps = {}, args = {}, opts = {}) => {
            const optsMod = util.merge({ depth: Infinity }, opts);
            return compose(path, deps, args, optsMod);
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

        Object.assign(compose, session.external, { deep, end });
        return { compose, constants };
    };

    const composer = createComposer(userOptions.config);
    const configure = Configure(createComposer);
    return { ...composer, configure };

};
