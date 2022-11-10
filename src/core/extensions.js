const util = require('./util');

const state = { extensions: {} };
const register = (name, extension) => Object.assign(state.extensions, { [name]: extension });

const setup = (session, compose) => {
    return Object.entries(state.extensions).reduce((acc, [name, ext]) => {
        const getState = () => session.state.extensions[name];
        const setState = state => util.set(session.state.extensions, name, state);

        const { compose, ...functions } = Object.fromEntries(Object.entries(ext).map(([name, func]) => {
            return [name, func({ ...session, getState, setState })];
        }));

        if (compose) acc.compose = compose(acc.compose);
        return { ...acc, ...functions };
    }, { compose });
};

module.exports = { register, setup };
