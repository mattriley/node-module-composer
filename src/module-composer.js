const _ = require('lodash');
const mermaidGraph = require('./mermaid-graph');
const isFunction = val => _.isFunction(val) && !(val.prototype && val.prototype.constructor === val);
const override = (obj, overrides = {}) => _.merge(obj, _.pick(overrides, Object.keys(obj)));
const defaultCustomiser = m => isFunction(m.setup) ? m.setup() : m;

module.exports = (target, ...configs) => {
    const config = _.merge({}, ...configs.flat());
    const options = _.merge({ customiser: defaultCustomiser }, config.moduleComposer);
    const modules = { ...target }, dependencies = _.mapValues(modules, () => []);
    const mermaid = opts => mermaidGraph(dependencies, opts);
    const composition = { config, target, modules, dependencies, mermaid };
    const getModules = () => ({ config, composition, ...modules });

    const composeRecursive = (target, args, parentKey) => {
        if (!_.isPlainObject(target)) return target;
        const product = {};
        const newArg = { [parentKey]: product, ...args };
        const newObj = _.mapValues(target, (val, key) => (isFunction(val) ? val(newArg) : composeRecursive(val, newArg, key)));
        return Object.assign(product, newObj);
    };

    const compose = (key, args = {}, customise = options.customiser) => {
        const totalArgs = { ...options.defaults, ...args };
        const module = customise(composeRecursive(target[key], totalArgs, key));
        modules[key] = override({ [key]: module }, options.overrides)[key];
        dependencies[key] = Object.keys(totalArgs);
        return getModules();
    };

    return { config, compose, getModules, mermaid };
};
