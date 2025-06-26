const freezeDeep = obj => {
    const propNames = Reflect.ownKeys(obj);
    for (const name of propNames) {
        const value = obj[name];
        if ((value && typeof value === 'object') || typeof value === 'function') freezeDeep(value);
    }
    return Object.freeze(obj);
};

module.exports = freezeDeep;
