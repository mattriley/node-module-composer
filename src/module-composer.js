const util = require('./util');

module.exports = (target, ...configs) => {
    const config = util.merge({}, ...configs.flat());
    const options = util.merge({ customiser: util.defaultCustomiser() }, config.moduleComposer);
    const modules = { ...target };
    const dependencies = util.mapValues(modules, () => []);
    const mermaid = opts => util.mermaid(dependencies, opts);

    const recurse = (target, args, parentKey) => {
        if (!util.isPlainObject(target)) return target;
        const product = {};
        const newArg = { [parentKey]: product, ...args };
        const evaluate = (val, key) => util.isPlainFunction(val) ? val(newArg) : recurse(val, newArg, key);
        const newObj = util.mapValues(target, evaluate);
        return Object.assign(product, newObj);
    };

    const compose = (key, args = {}, customise = options.customiser) => {
        const totalArgs = { ...options.defaults, ...args };
        const module = customise(recurse(target[key], totalArgs, key));
        modules[key] = util.override({ [key]: module }, options.overrides)[key];
        dependencies[key] = Object.keys(totalArgs);
        return composition.modules;
    };

    const props = Object.entries({ target, config, modules, dependencies }).flatMap(([key, val]) => [
        [`get${util.upperFirst(key)}`, { enumerable: true, value: () => ({ ...val }) }],
        [key, { enumerable: true, get() { return { ...val }; } }]
    ]);

    const composition = Object.defineProperties({ mermaid }, Object.fromEntries(props));
    Object.assign(compose, { composition, ...composition });
    Object.defineProperties(compose, Object.fromEntries(props));
    return { compose, ...compose };
};
