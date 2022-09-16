/* eslint-disable no-prototype-builtins */
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

const isPlainFunction = val => isFunction(val) && !val.hasOwnProperty('prototype');
const mergeValues = (target, obj, keys) => merge(target, ...flattenDeep(pickValues(obj, keys)));
const pickValues = (obj, keys) => Object.values(pick(obj, keys));

const deepOmitKeys = (obj, pattern) => {
    return Object.fromEntries(Object.entries(obj).flatMap(([key, val]) => {
        const privateName = key.match(pattern) ? key : `_${key}`;
        if (key === privateName || obj[privateName]) return [];
        const newVal = isPlainObject(val) ? deepOmitKeys(val, pattern) : val;
        return [[key, newVal]];
    }));
};

const deepDupeKeys = (obj, pattern) => {
    return Object.fromEntries(Object.entries(obj).flatMap(([key, val]) => {
        const newKey = key.replace(pattern, '');
        if (key.match(pattern)) return [[key, val], [newKey, val]];
        const newVal = isPlainObject(val) ? deepDupeKeys(val, pattern) : val;
        return [[key, newVal]];
    }));
};

module.exports = {
    deepDupeKeys,
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
