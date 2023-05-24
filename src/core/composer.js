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

    const configure = (...configs) => {
        const flatConfigs = configs.filter(c => !!c).flatMap(c => Array.isArray(c) ? c : [c]);
        const constants = flatConfigs.reduce((acc, x) => {
            const config = typeof x === 'function' ? x(acc) : x;
            return util.merge(acc, config);
        }, {});
        return createComposer(constants);
    };

    const composer = createComposer(userOptions.config);
    return { ...composer, configure };

};
