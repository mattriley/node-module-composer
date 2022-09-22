const util = require('./util');

module.exports = props => {

    const { target, options } = props;

    const recurse = (target, parentKey, deps, args) => {
        if (!util.isPlainObject(target)) return target;
        const self = {};
        deps = util.set({ self, ...deps }, parentKey, self);
        const evaluate = (val, key) => util.isPlainFunction(val) ? val(deps, args) : recurse(val, key, deps, args);
        return Object.assign(self, util.mapValues(target, evaluate));
    };

    return (key, deps, args) => {
        if (!key) throw new Error('key is required');
        if (!util.has(target, key)) throw new Error(`${key} not found`);
        if (props.composedDependencies[key]) throw new Error(`${key} already composed`);
        const targetModule = util.deepAddUnprefixedKeys(util.get(target, key), options.privatePrefix);
        const recursed = recurse(targetModule, key, deps, args);
        const customised = util.invoke(recursed, options.customiser, args);
        if (customised && !util.isPlainObject(customised)) throw new Error(`${key} customiser must return plain object`);
        const privateModule = util.merge(customised ?? recursed, util.get(options.overrides, key));
        const publicModule = util.deepRemPrefixedKeys(privateModule, options.privatePrefix);
        util.set(props.modules, key, publicModule);
        const depKeys = Object.keys(deps).filter(k => k !== key);
        props.dependencies[key] = props.composedDependencies[key] = depKeys;
        return props.modules;
    };

};
