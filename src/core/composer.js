const Configure = require('./configure');
const Session = require('./session');

module.exports = (target, clientOptions = {}) => {

    const createComposer = (config = {}) => {
        const { internal, external } = Session(target, config, clientOptions);

        const make = (path, deps, opts) => internal.compose(path, deps, opts);
        const deep = (path, deps, opts) => make(path, deps, { ...opts, depth: Infinity });
        const asis = (path, opts) => make(path, null, opts);

        const end = () => {
            if (internal.state.ended) throw new Error('Composition has already ended');
            internal.state.ended = true;
            return external;
        };

        const compose = Object.assign(make, external, { make, deep, asis, end });
        return { compose, configure, ...internal.configAliases };
    };

    const configure = Configure(createComposer);
    return configure(clientOptions.config);

};
