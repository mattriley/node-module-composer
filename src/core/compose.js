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

    if (depth === 0 && deps) throw new Error('Unexpected deps');

    const self = {};
    const selfDeps = { ...session.configAliases, self, [key]: self, ...deps };

    const recurse = (target, deps = {}, currentDepth = 0, here = undefined, parent = undefined) => {
        if (currentDepth === depth) return target;
        if (!_.isPlainObject(target)) return target;

        const isTopLevel = currentDepth === 0;
        here = here || (isTopLevel ? self : {});

        // Phase 1: shallow assign all keys (without evaluating functions)
        for (const [key, val] of Object.entries(target)) {
            here[key] = _.isPlainObject(val)
                ? recurse(val, deps, currentDepth + 1, undefined, here)
                : val;
        }

        // Phase 2: now evaluate any functions in-place
        for (const [key, val] of Object.entries(here)) {
            if (val && typeof val === 'function') {
                const result = val({ self, here, parent, ...deps }, args);
                // only evaluate top-level function (not returned functions)
                here[key] = result;
            }
        }

        return (flat && isTopLevel)
            ? _.flattenObject(here)
            : here;
    };

    const apply = fns => input => fns.reduce((acc, fn) => Object.assign(acc, fn(acc)), input);

    const precomposers = apply([
        ...session.precomposers,
        ({ target, deps }) => ({ target: recurse(target, { ...selfDeps, ...deps }) }),
        ({ target }) => ({ target: _.invokeAtOrReturn(target, customiser, args) })
    ]);

    const postcomposers = apply([
        ({ target }) => ({ target: _.merge(target, overrides) }),
        ...session.postcomposers,
        ({ key, target }) => {
            session.registerModule({ path, key, target, deps, options });
            return {};
        }
    ]);

    const initial = { key, target, deps, self, options };
    const { target: maybePromise, ...rest } = precomposers(initial);

    const next = final => {
        postcomposers({ ...rest, target: final });
        return session.modules;
    };

    return _.isPromise(maybePromise) ? maybePromise.then(next) : next(maybePromise);
};
