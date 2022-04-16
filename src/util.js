const merge = require('lodash.merge');
const isFunction = val => typeof val === 'function';
const isObject = val => val !== null && val.constructor.name === 'Object';
const mapValues = (obj, cb) => Object.entries(obj).reduce((acc, [key, val]) => Object.assign(acc, { [key]: cb(val, key) }), {});
const pick = (obj, keys) => keys.reduce((acc, key) => Object.assign(acc, { [key]: obj[key] }), {});
const override = (obj, overrides) => merge(obj, pick(overrides, Object.keys(obj)));
module.exports = { merge, isFunction, isObject, mapValues, override };
