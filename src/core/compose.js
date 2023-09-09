const _ = require('./util');

module.exports = session => (path, deps, opts = {}) => {

    if (!path) throw new Error('Missing path');
    if (!_.has(session.target, path)) throw new Error(`${path} not found`);
    const target = _.get(session.target, path);
    if (!_.isPlainObject(target)) throw new Error(`${path} must be a plain object`);
    if (session.composedDependencies[path]) throw new Error(`${path} is already composed`);
    const options = session.getComposeOptions(path, opts);
    const { args, customiser, depth, flat, overrides } = options;
    if (depth === 0 && !!deps) throw new Error('Unexpected deps');

    const self = {};
    const depsMod = { [path]: self, self, ...session.configAliases, ...deps };
    const argsMod = { ...session.configAliases, ...args };

    const recurse = (target, currentDepth = 0) => {
        if (currentDepth === depth) return target;
        if (!_.isPlainObject(target)) return target;
        const here = currentDepth === 0 ? self : {};
        const evaluate = val => _.isPlainFunction(val) ? val({ here, ...depsMod }, argsMod) : recurse(val, currentDepth + 1);
        const evaluated = _.mapValues(target, evaluate);
        const result = flat ? _.flattenObject(evaluated) : evaluated;
        return Object.assign(here, result);
    };

    const maybePromise = _.flow([
        ...session.precomposers.map(func => target => func({ path, target, options }) ?? target),
        target => recurse(target),
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
