const freezeDeep = obj => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Object.isFrozen(obj)) return obj;
    for (const key of Reflect.ownKeys(obj)) {
        const val = obj[key];
        if (val && (typeof val === 'object' || typeof val === 'function')) {
            freezeDeep(val);
        }
    }
    return Object.freeze(obj);
};

module.exports = freezeDeep;
