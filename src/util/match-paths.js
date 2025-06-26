const isPlainObject = require('lodash/isPlainObject');

const matchPaths = (obj, cb, depth, currentDepth = 0, currentPath = []) => {
    return Object.entries(obj).flatMap(([key, val]) => {
        const path = [...currentPath, key];
        const res1 = !isPlainObject(val) && cb(key) ? [path] : [];
        const res2 = isPlainObject(val) ? matchPaths(val, cb, depth, currentDepth + 1, path) : [];
        return [...res1, ...res2];
    });
};

module.exports = matchPaths;
