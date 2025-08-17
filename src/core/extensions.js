const _ = require('./util');

// Pick a stable key per file/dir across environments
function getStateKey() {
    // Node (CJS): __dirname is available
    if (typeof __dirname !== 'undefined') return __dirname;

    // Browser: derive a "directory URL" for this script
    // - currentScript.src if available (classic scripts)
    // - document.baseURI or location.href as a fallback
    if (typeof document !== 'undefined') {
        const base = (document.currentScript && document.currentScript.src) || document.baseURI || (typeof location !== 'undefined' ? location.href : '');
        try {
            return new URL('.', base).href; // normalize to a directory-like URL
        } catch {
            return base || 'global';
        }
    }
    if (typeof location !== 'undefined') {
        try { return new URL('.', location.href).href; } catch { }
        return location.href;
    }

    // Last resort
    return 'global';
}

const stateContainer = globalThis;
const stateKey = getStateKey();

if (!stateContainer[stateKey]) stateContainer[stateKey] = { extensions: {} };

const register = (name, extension) =>
    Object.assign(stateContainer[stateKey].extensions, { [name]: extension });

const setup = (session) => {
    const extensionNames = Object.keys(stateContainer[stateKey].extensions);
    return extensionNames.reduce((acc, name) => {
        const ext = stateContainer[stateKey].extensions[name];
        const getState = () => session.extensions[name];
        const setState = (state) => _.set(session.extensions, name, { ...getState(), ...state })[name];

        const arg = { ...session, getState, setState };
        const { precompose, postcompose, ...functions } = _.mapValues(ext, (func) => func(arg));

        if (precompose) acc.precomposers.push(precompose);
        if (postcompose) acc.postcomposers.push(postcompose);
        return { ...acc, ...functions };
    }, { precomposers: [], postcomposers: [] });
};

module.exports = { register, setup };
