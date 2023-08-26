const util = require('./util');

module.exports = session => (path, deps, opts) => {

    const defaultOptions = { args: {}, alias: [] };
    const options = util.merge({}, defaultOptions, session.options, opts);
    const { depth, customiser, overrides } = options;

    const recurse = (target, parentPath, deps, currentDepth = 0) => {
        if (currentDepth === depth) return target;
        if (!util.isPlainObject(target)) return target;
        const self = {};
        const depsMod = util.set({ self, ...session.configAliases, ...deps }, parentPath, self);
        const argsMod = { ...session.configAliases, ...options.args };
        const evaluate = (val, key) => util.isPlainFunction(val) ? val(depsMod, argsMod) : recurse(val, [parentPath, key].join('.'), depsMod, currentDepth + 1);
        return Object.assign(self, util.mapValues(target, evaluate));
    };

    if (!path) throw new Error('key is required');
    if (!util.has(session.target, path)) throw new Error(`${path} not found`);

    const target = util.get(session.target, path);

    if (!util.isPlainObject(target)) throw new Error(`${path} must be a plain object`);
    if (session.state.composedDependencies[path]) throw new Error(`${path} is already composed`);

    const maybePromise = util.flow([
        ...session.precomposers.map(func => target => func(path, target, options)),
        target => recurse(target, path, deps),
        target => util.has(target, customiser) ? util.invoke(target, customiser, options.args) : target
    ])(target);

    const next = target => {
        if (customiser && !util.isPlainObject(target)) throw new Error(`${path}.${customiser} must return a plain object`);

        return util.flow([
            target => util.merge(target, util.get(overrides, path)),
            ...session.postcomposers.map(func => target => func(path, target, options)),
            target => {
                session.registerModule(path, target, deps);
                [options.alias].flat().forEach(alias => session.registerAlias(alias, target));
                return session.state.modules;
            }
        ])(target);
    };

    return util.isPromise(maybePromise) ? maybePromise.then(next) : next(maybePromise);

};
