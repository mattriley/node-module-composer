const util = require('./util');

module.exports = props => {

    const { target, options } = props;

    const recurse = (target, parentKey, deps) => {
        if (!util.isPlainObject(target)) return target;
        const product = {};
        deps = util.set({ ...deps }, parentKey, product);
        const evaluate = (val, key) => util.isPlainFunction(val) ? val(deps) : recurse(val, key, deps);
        return Object.assign(product, util.mapValues(target, evaluate));
    };

    return (key, deps) => {
        if (!key) throw new Error('key is required');
        if (!util.has(target, key)) throw new Error(`${key} not found`);
        if (props.composedDependencies[key]) throw new Error(`${key} already composed`);
        deps = { ...options.defaults, ...deps };
        const recursed = recurse(util.get(target, key), key, deps);
        const customised = util.invoke(recursed, options.customiser, recursed) ?? recursed;
        const overridden = util.merge(customised, util.get(options.overrides, key));
        const omitted = util.deepOmitKeys(overridden, key => key.match(options.omitPattern));
        util.set(props.modules, key, omitted);
        props.dependencies[key] = props.composedDependencies[key] = Object.keys(deps);
        return props.modules;
    };

};
