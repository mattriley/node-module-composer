const _ = require('./util');

const stateContainer = globalThis;
const stateKey = __dirname;
if (!stateContainer[stateKey]) stateContainer[stateKey] = { extensions: {} };
const register = (name, extension) => Object.assign(stateContainer[stateKey].extensions, { [name]: extension });

const setup = session => {
    const extensionNames = Object.keys(stateContainer[stateKey].extensions);
    return extensionNames.reduce((acc, name) => {
        const ext = stateContainer[stateKey].extensions[name];
        const getState = () => session.extensions[name];
        const setState = state => _.set(session.extensions, name, { ...getState(), ...state })[name];
        const arg = { ...session, getState, setState };
        const { precompose, postcompose, ...functions } = _.mapValues(ext, func => func(arg));
        if (precompose) acc.precomposers.push(precompose);
        if (postcompose) acc.postcomposers.push(postcompose);
        return { ...acc, ...functions };
    }, { precomposers: [], postcomposers: [] });
};

module.exports = { register, setup };
