const isFunction = val => typeof val === 'function';

const isObject = val => val !== null && val.constructor.name === 'Object';

const forEach = (obj, cb) => Object.entries(obj).forEach(([key, val]) => cb(val, key));

const mapValues = (obj, cb) => Object.entries(obj).reduce((acc, [key, val]) => Object.assign(acc, { [key]: cb(val, key) }), {});

const pick = (obj, keys) => keys.reduce((acc, key) => Object.assign(acc, { [key]: obj[key] }), {});

module.exports = { isFunction, isObject, forEach, mapValues, pick };
