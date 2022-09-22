const util = require('./util');

module.exports = props => (key, deps, args, opts) => {

    const { target, options } = props;
    const { depth, privatePrefix, customiser, overrides } = util.merge({}, options, opts);

    const recurse = (target, parentKey, deps, currentDepth = 0) => {
        if (currentDepth === depth) return target;
        if (!util.isPlainObject(target)) return target;
        const self = {};
        const depsMod = util.set({ self, ...deps }, parentKey, self);
        const evaluate = (val, key) => util.isPlainFunction(val) ? val(depsMod, args) : recurse(val, key, depsMod, currentDepth + 1);
        return Object.assign(self, util.mapValues(target, evaluate));
    };

    if (!key) throw new Error('key is required');
    if (!util.has(target, key)) throw new Error(`${key} not found`);
    if (props.composedDependencies[key]) throw new Error(`${key} already composed`);
    const targetModule = util.deepAddUnprefixedKeys(util.get(target, key), privatePrefix);
    const recursed = recurse(targetModule, key, deps);
    const customised = util.invoke(recursed, customiser, args);
    if (customised && !util.isPlainObject(customised)) throw new Error(`${key} customiser must return plain object`);
    const privateModule = util.merge(customised ?? recursed, util.get(overrides, key));
    const publicModule = util.deepRemPrefixedKeys(privateModule, privatePrefix);
    util.set(props.modules, key, publicModule);
    const depKeys = Object.keys(deps).filter(k => k !== key);
    props.dependencies[key] = props.composedDependencies[key] = depKeys;
    return props.modules;

};
