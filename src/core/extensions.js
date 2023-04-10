const util = require('./util');

const state = { extensions: {} };
const register = (name, extension) => Object.assign(state.extensions, { [name]: extension });

const setup = (session, compose, globalThis) => {
    return Object.entries(state.extensions).reduce((acc, [name, ext]) => {
        const disabled = session.options.extensions === false || !session.options.extensions.includes(name);
        if (disabled) return acc;
        const getState = () => session.state.extensions[name];
        const setState = state => util.set(session.state.extensions, name, { ...getState(), ...state });
        const arg = { ...session, getState, setState, globalThis };
        const { compose, precustomise, postcustomise, ...functions } = util.mapValues(ext, func => func(arg));
        if (compose) acc.compose = compose(acc.compose);
        if (precustomise) acc.precustomisers.push(precustomise);
        if (postcustomise) acc.postcustomisers.push(postcustomise);
        return { ...acc, ...functions };
    }, { compose, precustomisers: [], postcustomisers: [] });
};



module.exports = { register, setup };
