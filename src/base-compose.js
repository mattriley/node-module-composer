const util = require('./util');

module.exports = (props, state) => (key, deps, args, opts) => {

    const { target, options } = props;
    const { depth, privatePrefix, customiser, overrides } = util.merge({}, options, opts);
    const privatePattern = new RegExp(`^${privatePrefix}`);

    const recurse = (target, parentKey, deps, currentDepth = 0) => {
        if (currentDepth === depth) return target;
        if (!util.isPlainObject(target)) return target;
        const self = {};
        const depsMod = util.set({ self, ...deps }, parentKey, self);
        const evaluate = (val, key) => util.isPlainFunction(val) ? val(depsMod, args) : recurse(val, key, depsMod, currentDepth + 1);
        return Object.assign(self, util.mapValues(target, evaluate));
    };

    if (!key) throw new Error('key is required');
    if (!util.has(target, key)) throw new Error(`${key} not found`);

    const targetModule = util.get(target, key);

    if (!util.isPlainObject(targetModule)) throw new Error(`${key} must be a plain object`);
    if (state.composedDependencies[key]) throw new Error(`${key} is already composed`);

    const privates = util.matchPaths(targetModule, privatePattern, depth);
    const replacements = Object.fromEntries(privates.map(path => [
        path.join('.'),
        path.map(str => str.replace(privatePattern, '')).join('.')
    ]));
    const internal = util.replacePaths(targetModule, replacements);
    const recursed = recurse(internal, key, deps);
    const customised = util.invoke(recursed, customiser, args);

    const next = customised => {
        if (customised && !util.isPlainObject(customised)) throw new Error(`${key}.${customiser} must return a plain object`);
        const overridden = util.merge(customised ?? recursed, util.get(overrides, key));
        const external = util.removePaths(overridden, Object.values(replacements));
        state.registerModule(key, external, deps);
        return state.modules;
    };

    return util.isPromise(customised) ? customised.then(next) : next(customised);

};
