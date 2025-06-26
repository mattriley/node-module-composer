const isPlainObject = require('./is-plain-object');

module.exports = (obj, opts = {}) => {
    const recurse = (obj, parentKey = '', currentDepth = 0) => {
        return Object.entries(obj).reduce((acc, [key, val]) => {
            const done = !isPlainObject(val);
            const newKey = parentKey && opts.delimiter ? parentKey + opts.delimiter + key : key;
            if (done) return { ...acc, [newKey]: val };
            const changes = recurse(val, opts.delimiter ? newKey : '', currentDepth + 1);
            const collision = Object.keys(changes).find(key => acc[key]);
            if (collision) throw new Error(`Collision: ${collision}`);
            return { ...acc, ...changes };
        }, {});
    };
    return recurse(obj);
};
