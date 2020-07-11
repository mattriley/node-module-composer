const composeEntries = (obj, arg) => {
    const composeEntry = val => val instanceof Function ? val(arg) : compose(val, arg);
    return Object.entries(obj).reduce((acc, [key, val]) => Object.assign(acc, { [key]: composeEntry(val) }), {});
};

const compose = (obj, arg) => {
    const { __modulename, ...entries } = obj;
    if (!__modulename) return obj;
    const product = {};
    const newArg = { [__modulename]: product, ...arg };
    return Object.assign(product, composeEntries(entries, newArg));
};

module.exports = compose;
