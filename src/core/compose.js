const _ = require('./util');
const flatten = module => _.mapKeys(_.flat(module), (v, k) => k.split('.').pop());

module.exports = session => (path, deps, opts = {}) => {

    if (!path) throw new Error('Missing path');
    if (!_.has(session.target, path)) throw new Error(`${path} not found`);
    const target = _.get(session.target, path);
    if (!_.isPlainObject(target)) throw new Error(`${path} must be a plain object`);
    if (session.composedDependencies[path]) throw new Error(`${path} is already composed`);

    const options = session.getModuleOptions(path, opts);
    const { args, customiser, depth, flat, overrides } = options;

    if (depth === 0 && !!deps) throw new Error('Unexpected deps');

    const recurse = (target, parentPath, deps, currentDepth = 0) => {
        if (currentDepth === depth) return target;
        if (!_.isPlainObject(target)) return target;
        const self = {};
        const depsMod = _.set({ self, ...session.configAliases, ...deps }, parentPath, self);
        const argsMod = { ...session.configAliases, ...args };
        const evaluate = (val, key) => _.isPlainFunction(val) ? val(depsMod, argsMod) : recurse(val, [parentPath, key].join('.'), depsMod, currentDepth + 1);
        const evaluated = _.mapValues(target, evaluate);
        const maybeFlattened = flat ? flatten(evaluated) : evaluated;
        return Object.assign(self, maybeFlattened);
    };

    const maybePromise = _.flow([
        ...session.precomposers.map(func => target => func({ path, target, options }) ?? target),
        target => recurse(target, path, deps),
        target => _.invokeAtOrReturn(target, customiser, args)
    ])(target);

    const next = target => {
        if (customiser && !_.isPlainObject(target)) throw new Error(`${path}.${customiser} must return a plain object`);

        return _.flow([
            target => _.merge(target, _.get(overrides, path)),
            ...session.postcomposers.map(func => target => func({ path, target, options }) ?? target),
            target => session.registerModule(path, target, deps)
        ])(target);
    };

    return _.isPromise(maybePromise) ? maybePromise.then(next) : next(maybePromise);

};
