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

    const recurse = (target, deps = {}, currentDepth = 0, here = undefined, parent = undefined) => {
        if (currentDepth === depth) return target;
        if (!_.isPlainObject(target)) return target;

        // Reuse `self` at the root, otherwise make a new `here` for this level
        here = here || (currentDepth === 0 ? self : {});

        for (const [key, val] of Object.entries(target)) {
            let resolved = val;

            // Step 1: recurse early if it's a plain object (bottom-up traversal)
            if (_.isPlainObject(val)) {
                resolved = recurse(val, deps, currentDepth + 1, undefined, here);
            }

            // Step 2: evaluate if it's a function *after* recursion
            if (_.isPlainFunction(resolved)) {
                resolved = resolved({ self, here, parent, ...deps }, args);
            }

            here[key] = resolved;
        }

        // Only flatten at the top level (where `self` is returned)
        if (flat && currentDepth === 0) {
            return _.flattenObject(here);
        }

        return here;
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
