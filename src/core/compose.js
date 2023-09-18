const _ = require('./util');

module.exports = session => (path, deps, opts = {}) => {

    if (!path) throw new Error('Missing path');
    if (!_.has(session.target, path)) throw new Error(`${path} not found`);
    const target = _.get(session.target, path);
    if (!_.isPlainObject(target)) throw new Error(`${path} must be a plain object`);

    const key = path.split('.').pop();
    if (session.dependencies[key]) throw new Error(`${key} is already composed`);
    const options = session.getComposeOptions(key, opts);
    const { args, customiser, depth, flat, overrides } = options;
    if (depth === 0 && !!deps) throw new Error('Unexpected deps');

    const self = {};
    const selfDeps = { ...session.configAliases, self, [key]: self, ...deps };

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
        ...session.precomposers.map(fun => arg => fun(arg)),
        ({ target, deps }) => ({ target: recurse(target, { ...selfDeps, ...deps }) }),
        ({ target }) => ({ target: _.invokeAtOrReturn(target, customiser, args) })
    ];

    const postcomposers = [
        ({ key, target }) => ({ target: _.merge(target, _.get(overrides, key)) }),
        ...session.postcomposers.map(fun => arg => fun(arg)),
        ({ key, target }) => { session.registerModule({ path, key, target, deps, options }); }
    ];

    const { target: targetMaybePromise, ...precomposeResult } = _.pipeAssign(precomposers, { key, target, deps, self, options });

    const next = target => {
        if (customiser && !_.isPlainObject(target)) throw new Error(`${path}.${customiser} must return a plain object`);
        _.pipeAssign(postcomposers, { target, ...precomposeResult });
        return session.modules;
    };

    return _.isPromise(targetMaybePromise) ? targetMaybePromise.then(next) : next(targetMaybePromise);

};
