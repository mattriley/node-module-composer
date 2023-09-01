const util = require('./util');

module.exports = session => (path, deps, opts = {}) => {

    if (!path) throw new Error('Missing path');
    if (!util.has(session.target, path)) throw new Error(`${path} not found`);
    if (deps === undefined) throw new Error('Missing dependencies');
    const target = util.get(session.target, path);
    if (!util.isPlainObject(target)) throw new Error(`${path} must be a plain object`);
    if (session.composedDependencies[path]) throw new Error(`${path} is already composed`);

    const options = session.getModuleOptions(path, opts);
    const { args, customiser, depth, overrides } = options;

    const recurse = (target, parentPath, deps, currentDepth = 0) => {
        if (!deps) return target;
        if (currentDepth === depth) return target;
        if (!util.isPlainObject(target)) return target;
        const self = {};
        const depsMod = util.set({ self, ...session.configAliases, ...deps }, parentPath, self);
        const argsMod = { ...session.configAliases, ...args };
        const evaluate = (val, key) => util.isPlainFunction(val) ? val(depsMod, argsMod) : recurse(val, [parentPath, key].join('.'), depsMod, currentDepth + 1);
        return Object.assign(self, util.mapValues(target, evaluate));
    };

    const maybePromise = util.flow([
        ...session.precomposers.map(func => target => func({ path, target, options }) ?? target),
        target => recurse(target, path, deps),
        target => util.invokeAtOrReturn(target, customiser, args)
    ])(target);

    const next = target => {
        if (customiser && !util.isPlainObject(target)) throw new Error(`${path}.${customiser} must return a plain object`);

        return util.flow([
            target => util.merge(target, util.get(overrides, path)),
            ...session.postcomposers.map(func => target => func({ path, target, options }) ?? target),
            target => session.registerModule(path, target, deps)
        ])(target);
    };

    return util.isPromise(maybePromise) ? maybePromise.then(next) : next(maybePromise);

};
