const util = require('./util');
const eject = require('./eject');
const mermaid = require('./mermaid');
const composers = require('./composers');
const defaultOptions = require('./default-options');
const initialiseState = require('./initialise-state');

module.exports = (target, userOptions = {}) => {

    if (!util.isPlainObject(target)) throw new Error('target must be a plain object');

    const targetModules = util.pickBy(target, util.isPlainObject);
    const options = util.merge({}, defaultOptions, userOptions);
    const config = util.mergeValues({}, options, options.configKeys);
    const state = initialiseState(targetModules, options, config);

    const props = {
        compositionName: options.compositionName,
        defaultOptions, userOptions, options,
        target, config, ...state,
        mermaid: opts => mermaid(state.dependencies, opts),
        eject: () => eject(targetModules, state.composedDependencies)
    };

    const baseCompose = composers.base(props, state);
    const timeCompose = composers.time(props, baseCompose);
    const composeFunc = options.stats ? timeCompose : baseCompose;

    const end = () => {
        if (state.ended) throw new Error('Composition has already ended');
        state.ended = true;
        return props;
    };

    const compose = (key, deps = {}, args = {}, opts = {}) => {
        if (state.ended) throw new Error('Composition has ended');
        return composeFunc(key, deps, args, opts);
    };

    compose.deep = (key, deps = {}, args = {}, opts = {}) => {
        const optsMod = util.merge({ depth: Infinity }, opts);
        return compose(key, deps, args, optsMod);
    };

    if (!globalThis.compositions) globalThis.compositions = [];
    globalThis.compositions.push(props);

    Object.assign(compose, props, { end });
    return { compose, config };

};
