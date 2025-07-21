const _ = require('./util');

module.exports = session => (path, deps, opts = {}) => {

    if (!path) throw new Error('Missing path');
    if (!_.has(session.target, path)) throw new Error(`${path} not found`);
    const target = _.get(session.target, path);
    if (!_.isPlainObject(target)) throw new Error(`${path} must be a plain object`);

    const key = path.split('.').pop();
    if (deps?.[key]) throw new Error(`${key} already exists`);
    if (session.dependencies[key]) throw new Error(`${key} is already composed`);

    const options = session.getComposeOptions(key, opts);
    const { args, customiser, depth, flat, overrides } = options;
    if (depth === 0 && !!deps) throw new Error('Unexpected deps');

    const self = {};
    const selfDeps = { ...session.configAliases, self, [key]: self, ...deps };

    const recurse = (target, deps = {}, currentDepth = 0, here = undefined) => {
        if (currentDepth === depth) return target;
        if (!_.isPlainObject(target)) return target;

        // Create or reuse `here` for this level
        here = here || (currentDepth === 0 ? self : {});

        // First: recurse into child objects (bottom-up)
        for (const [key, val] of Object.entries(target)) {
            if (_.isPlainObject(val)) {
                here[key] = recurse(val, deps, currentDepth + 1);
            } else {
                here[key] = val;
            }
        }

        // Then: resolve any functions now that child values are available
        for (const [key, val] of Object.entries(here)) {
            if (_.isPlainFunction(val)) {
                here[key] = val({ self, here, ...deps }, args);
            }
        }

        const result = flat ? _.flattenObject(here) : here;
        return result;
    };

    const precomposers = [
        ...session.precomposers.map(fun => arg => fun(arg)),
        ({ target, deps }) => ({ target: recurse(target, { ...selfDeps, ...deps }) }),
        ({ target }) => ({ target: _.invokeAtOrReturn(target, customiser, args) })
    ];

    const postcomposers = [
        ({ target }) => ({ target: _.merge(target, overrides) }),
        ...session.postcomposers.map(fun => arg => fun(arg)),
        ({ key, target }) => { session.registerModule({ path, key, target, deps, options }); }
    ];

    const { target: targetMaybePromise, ...precomposeResult } = _.pipeAssign({ key, target, deps, self, options }, ...precomposers);

    const next = target => {
        _.pipeAssign({ target, ...precomposeResult }, ...postcomposers);
        return session.modules;
    };

    return _.isPromise(targetMaybePromise) ? targetMaybePromise.then(next) : next(targetMaybePromise);

};
