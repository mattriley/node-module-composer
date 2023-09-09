const _ = require('./util');

module.exports = session => (path, deps, opts = {}) => {

    if (!path) throw new Error('Missing path');
    if (!_.has(session.target, path)) throw new Error(`${path} not found`);
    const target = _.get(session.target, path);
    if (!_.isPlainObject(target)) throw new Error(`${path} must be a plain object`);
    if (session.composedDependencies[path]) throw new Error(`${path} is already composed`);

    const options = session.getModuleOptions(path, opts);
    const { args, customiser, depth, flat, overrides } = options;
    if (depth === 0 && !!deps) throw new Error('Unexpected deps');

    const recurse = (target, deps, currentDepth = 0) => {
        if (currentDepth === depth) return target;
        if (!_.isPlainObject(target)) return target;
        const self = {};
        const depsMod = { [path]: self, self, ...session.configAliases, ...deps };
        const argsMod = { ...session.configAliases, ...args };
        const evaluate = val => _.isPlainFunction(val) ? val(depsMod, argsMod) : recurse(val, depsMod, currentDepth + 1);
        const evaluated = _.mapValues(target, evaluate);
        if (!flat) return Object.assign(self, evaluated);
        const flattened = _.flattenObject(evaluated, { delimiter: null });
        return Object.assign(_.clearObject(self), flattened);
    };

    const maybePromise = _.flow([
        ...session.precomposers.map(func => target => func({ path, target, options }) ?? target),
        target => recurse(target, deps),
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
