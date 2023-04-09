const util = require('./util');

module.exports = session => (path, deps, args, opts) => {

    const { target, options } = session;
    const { depth, privatePrefix, customiser, overrides } = util.merge({}, options, opts);

    const recurse = (target, parentPath, deps, currentDepth = 0) => {
        if (currentDepth === depth) return target;
        if (!util.isPlainObject(target)) return target;
        const self = {};
        const depsMod = util.set({ self, ...deps }, parentPath, self);
        const evaluate = (val, key) => util.isPlainFunction(val) ? val(depsMod, args) : recurse(val, [parentPath, key].join('.'), depsMod, currentDepth + 1);
        return Object.assign(self, util.mapValues(target, evaluate));
    };


    if (!path) throw new Error('key is required');
    if (!util.has(target, path)) throw new Error(`${path} not found`);

    const targetModule = util.get(target, path);

    if (!util.isPlainObject(targetModule)) throw new Error(`${path} must be a plain object`);
    if (session.state.composedDependencies[path]) throw new Error(`${path} is already composed`);

    const privatePaths = util.matchPaths(targetModule, privatePrefix, depth);
    const internalPaths = privatePaths.map(path => path.map(str => str.replace(privatePrefix, '')));
    const internal = util.replacePaths(targetModule, privatePaths, internalPaths);
    const recursed = recurse(internal, path, deps);
    const customised = util.invoke(recursed, customiser, args);

    const next = customised => {
        if (customised && !util.isPlainObject(customised)) throw new Error(`${path}.${customiser} must return a plain object`);
        const overridden = util.merge(customised ?? recursed, util.get(overrides, path));
        const external = util.removePaths(overridden, internalPaths);
        return session.registerModule(path, external, deps);
    };

    return util.isPromise(customised) ? customised.then(next) : next(customised);

};
