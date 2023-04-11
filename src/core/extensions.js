const util = require('./util');

const state = { extensions: {} };
const register = (name, extension) => Object.assign(state.extensions, { [name]: extension });

const setup = (session, compose, globalThis) => {
    return Object.entries(state.extensions).reduce((acc, [name, ext]) => {
        const disabled = session.options.extensions === false || Array.isArray(session.options.extensions) && !session.options.extensions.includes(name);
        if (disabled) return acc;
        const getState = () => session.state.extensions[name];
        const setState = state => util.set(session.state.extensions, name, { ...getState(), ...state });
        const arg = { ...session, getState, setState, globalThis };
        const { compose, precompose, postcompose, ...functions } = util.mapValues(ext, func => func(arg));
        if (compose) acc.compose = compose(acc.compose);
        if (precompose) acc.precomposers.push(precompose);
        if (postcompose) acc.postcomposers.push(postcompose);
        return { ...acc, ...functions };
    }, { compose, precomposers: [], postcomposers: [] });
};

module.exports = { register, setup };
