const state = { extensions: {} };
const register = (name, extension) => Object.assign(state.extensions, { [name]: extension });
const entries = () => Object.entries(state.extensions);
module.exports = { register, entries };
