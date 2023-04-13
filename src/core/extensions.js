const util = require('./util');

const stateContainer = globalThis;
if (!stateContainer.moduleComposer) stateContainer.moduleComposer = { extensions: {} };
const register = (name, extension) => Object.assign(stateContainer.moduleComposer.extensions, { [name]: extension });

const normaliseExtensions = session => {
    const loaded = Object.keys(stateContainer.moduleComposer.extensions);
    if (session.options.extensions === false) return {};
    if (session.options.extensions === true) return Object.fromEntries(loaded.map(name => [name, { enabled: true }]));
    if (!session.options.extensions) return Object.fromEntries(loaded.map(name => [name, { enabled: true }]));
    if (Array.isArray(session.options.extensions)) return Object.fromEntries(session.options.extensions.map(name => [name, { enabled: true }]));
    if (util.isPlainObject(session.options.extensions)) {
        return Object.fromEntries(Object.entries(session.options.extensions).map(([name, config]) => {
            const enabled = config.enabled ?? true;
            return [name, { ...config, enabled }];
        }));
    }
    throw new Error('Failed to interpret extensions');
};

const setup = (session, compose) => {
    const extensions = normaliseExtensions(session);
    return Object.entries(extensions).reduce((acc, [name, config]) => {
        if (!config.enabled) return acc;
        const ext = stateContainer.moduleComposer.extensions[name];
        const getState = () => session.state.extensions[name];
        const setState = state => util.set(session.state.extensions, name, { ...getState(), ...state });
        const arg = { ...session, getState, setState };
        const { compose, precompose, postcompose, ...functions } = util.mapValues(ext, func => func(arg, config));
        if (compose) acc.compose = compose(acc.compose);
        if (precompose) acc.precomposers.push(precompose);
        if (postcompose) acc.postcomposers.push(postcompose);
        return { ...acc, ...functions };
    }, { compose, precomposers: [], postcomposers: [] });
};

module.exports = { register, setup };
