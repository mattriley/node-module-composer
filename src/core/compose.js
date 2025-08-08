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

        // Allocate target object early (for reference identity)
        here = here || (isTopLevel ? self : {});
        const result = here;

        // Phase 1: assign nested objects immediately (recursive)
        for (const [key, val] of Object.entries(target)) {
            if (_.isPlainObject(val)) {
                result[key] = recurse(val, deps, currentDepth + 1, undefined, result);
            }
        }

        // Phase 2: evaluate and assign non-objects (functions, primitives)
        for (const [key, val] of Object.entries(target)) {
            if (_.isPlainObject(val)) continue;

            if (typeof val === 'function') {
                try {
                    const resolved = val({ self, here: result, parent, ...deps }, args);
                    result[key] = resolved;
                } catch {
                    result[key] = val; // fallback
                }
            } else {
                result[key] = val;
            }
        }

        return (flat && isTopLevel)
            ? _.flattenObject(result)
            : result;
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
