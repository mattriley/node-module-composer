const flattenDeep = require('lodash/flattenDeep');
const get = require('lodash/get');
const has = require('lodash/has');
const invoke = require('lodash/invoke');
const isFunction = require('lodash/isFunction');
const isPlainObject = require('lodash/isPlainObject');
const mapValues = require('lodash/mapValues');
const merge = require('lodash/merge');
const pick = require('lodash/pick');
const set = require('lodash/set');
const upperFirst = require('lodash/upperFirst');

const isPlainFunction = val => isFunction(val) && !(val.prototype && val.prototype.constructor === val);
const mergeValues = (target, obj, keys) => merge(target, ...flattenDeep(pickValues(obj, keys)));
const pickValues = (obj, keys) => Object.values(pick(obj, keys));

const deepOmitKeys = (obj, omit) => {
    return Object.fromEntries(Object.entries(obj).flatMap(([key, val]) => {
        if (omit(key)) return [];
        const newVal = isPlainObject(val) ? deepOmitKeys(val, omit) : val;
        return [[key, newVal]];
    }));
};

module.exports = {
    deepOmitKeys,
    get,
    has,
    invoke,
    isPlainFunction,
    isPlainObject,
    mapValues,
    merge,
    mergeValues,
    set,
    upperFirst
};
