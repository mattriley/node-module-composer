const util = require('./util');
const polystruct = require('polystruct');

const stateContainer = globalThis;
if (!stateContainer.moduleComposer) stateContainer.moduleComposer = { extensions: {} };
const register = (name, extension) => Object.assign(stateContainer.moduleComposer.extensions, { [name]: extension });

const setup = (session, compose) => {
    const extensionNames = Object.keys(stateContainer.moduleComposer.extensions);
    const extensions = polystruct(session.options.extensions, extensionNames);
    return Object.entries(extensions).reduce((acc, [name, config]) => {
        const ext = stateContainer.moduleComposer.extensions[name];
        const getState = () => session.state.extensions[name];
        const setState = state => util.set(session.state.extensions, name, { ...getState(), ...state });
        const arg = { ...session, getState, setState };
        const { precompose, postcompose, ...functions } = util.mapValues(ext, func => func(arg, config));
        if (precompose) acc.precomposers.push(precompose);
        if (postcompose) acc.postcomposers.push(postcompose);
        return { ...acc, ...functions };
    }, { compose, precomposers: [], postcomposers: [] });
};

module.exports = { register, setup };
