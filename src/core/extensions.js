const _ = require('./util');

const stateContainer = globalThis;
if (!stateContainer.moduleComposer) stateContainer.moduleComposer = { extensions: {} };
const register = (name, extension) => Object.assign(stateContainer.moduleComposer.extensions, { [name]: extension });

const setup = session => {
    const extensionNames = Object.keys(stateContainer.moduleComposer.extensions);
    return extensionNames.reduce((acc, name) => {
        const ext = stateContainer.moduleComposer.extensions[name];
        const getState = () => session.extensions[name];
        const setState = state => _.set(session.extensions, name, { ...getState(), ...state });
        const arg = { ...session, getState, setState };
        const { precompose, postcompose, ...functions } = _.mapValues(ext, func => func(arg));
        if (precompose) acc.precomposers.push(precompose);
        if (postcompose) acc.postcomposers.push(postcompose);
        return { ...acc, ...functions };
    }, { precomposers: [], postcomposers: [] });
};

module.exports = { register, setup };
