const util = require('./util');

const state = { extensions: {} };
const register = (name, extension) => Object.assign(state.extensions, { [name]: extension });

const setup = (session, compose, globalThis) => {
    return Object.entries(state.extensions).reduce((acc, [name, ext]) => {
        const getState = () => session.state.extensions[name];
        const setState = state => util.set(session.state.extensions, name, { ...getState(), ...state });
        const arg = { ...session, getState, setState, globalThis };
        const { compose, ...functions } = util.mapValues(ext, func => func(arg));
        if (compose) acc.compose = compose(acc.compose);
        return { ...acc, ...functions };
    }, { compose });
};

module.exports = { register, setup };
