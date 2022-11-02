const state = { extensions: [] };
const register = ext => { state.extensions.push(ext); return ext; };
const filter = type => state.extensions.filter(ext => !!ext[type]);
const sessionExtensions = () => filter('session');
const composeExtensions = () => filter('compose');

module.exports = { register, sessionExtensions, composeExtensions };
