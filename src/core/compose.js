const _ = require('./util');

module.exports = session => (path, deps, opts = {}) => {

    if (!path) throw new Error('Missing path');
    if (!_.has(session.target, path)) throw new Error(`${path} not found`);
    const target = _.get(session.target, path);
    if (!_.isPlainObject(target)) throw new Error(`${path} must be a plain object`);
    if (session.dependencies[path]) throw new Error(`${path} is already composed`);
    const options = session.getComposeOptions(path, opts);
    const { args, customiser, depth, flat, overrides } = options;
    if (depth === 0 && !!deps) throw new Error('Unexpected deps');

    const self = {};
    const selfDeps = { ...session.configAliases, self, [path]: self, ...deps };

    const recurse = (target, deps = {}, currentDepth = 0) => {
        if (currentDepth === depth) return target;
        if (!_.isPlainObject(target)) return target;
        const here = currentDepth === 0 ? self : {};
        const evaluate = val => _.isPlainFunction(val) ? val({ here, ...deps }, args) : recurse(val, deps, currentDepth + 1);
        const evaluated = _.mapValues(target, evaluate);
        const result = flat ? _.flattenObject(evaluated) : evaluated;
        return Object.assign(here, result);
    };

    const precomposers = [
        ...session.precomposers,
        ({ target, deps }) => ({ target: recurse(target, { ...selfDeps, ...deps }) }),
        ({ target }) => ({ target: _.invokeAtOrReturn(target, customiser, args) })
    ];

    const { target: targetMaybePromise, ...postCustomise } = _.pipeAssign([
        ...precomposers.map(fun => arg => fun(arg))
    ], { path, target, deps, options });

    const next = target => {
        if (customiser && !_.isPlainObject(target)) throw new Error(`${path}.${customiser} must return a plain object`);
        const { deps } = postCustomise;

        _.pipeAssign([
            ({ target }) => ({ target: _.merge(target, _.get(overrides, path)) }),
            ...session.postcomposers.map(fun => arg => fun(arg)),
            ({ target }) => { session.registerModule(path, target, deps); }
        ], { path, target, options });

        return session.modules;
    };

    return _.isPromise(targetMaybePromise) ? targetMaybePromise.then(next) : next(targetMaybePromise);

};
