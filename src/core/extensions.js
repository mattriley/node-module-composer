const util = require('./util');

const stateContainer = globalThis;
if (!stateContainer.extensions) stateContainer.extensions = {};
const register = (name, extension) => Object.assign(stateContainer.extensions, { [name]: extension });

const listEnabled = session => {
    const loaded = Object.keys(stateContainer.extensions);
    if (session.options.extensions === false) return [];
    if (session.options.extensions === true) return loaded;
    if (!session.options.extensions) return loaded;
    if (Array.isArray(session.options.extensions)) return loaded.filter(ext => session.options.extensions.includes(ext));
    throw new Error('Failed to interpret extensions');
};

const setup = (session, compose) => {
    return listEnabled(session).reduce((acc, name) => {
        const ext = stateContainer.extensions[name];
        const getState = () => session.state.extensions[name];
        const setState = state => util.set(session.state.extensions, name, { ...getState(), ...state });
        const arg = { ...session, getState, setState };
        const config = session.options.extensionsConfig[name];
        const { compose, precompose, postcompose, ...functions } = util.mapValues(ext, func => func(arg, config));
        if (compose) acc.compose = compose(acc.compose);
        if (precompose) acc.precomposers.push(precompose);
        if (postcompose) acc.postcomposers.push(postcompose);
        return { ...acc, ...functions };
    }, { compose, precomposers: [], postcomposers: [] });
};

module.exports = { register, setup };
