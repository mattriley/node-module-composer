const Session = require('./session');
const _ = require('./util');

module.exports = (target, options = {}) => {

    const createConfigurer = () => {
        const mergeWith = (customiser, ...configs) => {
            const flatConfigs = [options.defaultConfig, options.config, ...configs].flat();
            const config = flatConfigs.reduce((acc, c) => _.mergeWith(acc, _.invokeOrReturn(c, acc), customiser), {});
            return createComposer(config);
        };
        const merge = (...configs) => mergeWith(undefined, ...configs);
        const configure = Object.assign(merge, { merge, mergeWith });
        return { configure };
    };

    const createComposer = (config = {}) => {
        const session = Session(target, options, config);
        const make = (path, deps, opts) => session.external.compose(path, deps, opts);
        const deep = (path, deps, opts) => make(path, deps, { ...opts, depth: Infinity });
        const asis = (path, opts) => make(path, null, opts);
        const done = () => session.external;
        const compose = Object.assign(make, session.external, { make, deep, asis, done });
        return { compose, configure, ...session.configAliases };
    };

    const { configure } = createConfigurer();
    return configure();

};
