const cloneDeep = value => {
    if (typeof value === 'function') return value;
    if (Array.isArray(value)) return value.map(cloneDeep);
    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).map(([key, val]) => [key, cloneDeep(val)])
        );
    }
    return value;
};

module.exports = cloneDeep;
