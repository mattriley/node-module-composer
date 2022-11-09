const state = { extensions: {} };
const register = (name, extension) => Object.assign(state.extensions, { [name]: extension });
const get = () => state.extensions;

module.exports = { register, get };
