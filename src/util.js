/* eslint-disable no-prototype-builtins */
const cloneDeep = require('lodash/cloneDeep');
const flattenDeep = require('lodash/flattenDeep');
const get = require('lodash/get');
const has = require('lodash/has');
const invoke = require('lodash/invoke');
const isFunction = require('lodash/isFunction');
const isPlainObject = require('lodash/isPlainObject');
const mapValues = require('lodash/mapValues');
const merge = require('lodash/merge');
const pick = require('lodash/pick');
const pickBy = require('lodash/pickBy');
const set = require('lodash/set');
const upperFirst = require('lodash/upperFirst');
const unset = require('lodash/unset');

const isPlainFunction = val => isFunction(val) && !val.hasOwnProperty('prototype');
const isPromise = val => val && typeof val.then == 'function';
const mergeValues = (target, obj, keys) => merge(target, ...flattenDeep(pickValues(obj, keys)));
const pickValues = (obj, keys) => Object.values(pick(obj, keys));

const matchPaths = (obj, pattern, depth, currentDepth = 0, currentPath = []) => {
    if (currentDepth === depth) return [];
    return Object.entries(obj).flatMap(([key, val]) => {
        const path = [...currentPath, key];
        if (pattern.test(key)) return [path];
        return isPlainObject(val) ? matchPaths(val, pattern, depth, currentDepth + 1, path) : [];
    });
};

const replacePaths = (obj, replacements) => {
    const target = cloneDeep(obj);
    Object.entries(replacements).forEach(([from, to]) => {
        unset(target, from);
        set(target, to, get(obj, from));
    });
    return target;
};

const removePaths = (obj, paths) => {
    const target = cloneDeep(obj);
    paths.forEach(path => unset(target, path));
    return target;
};

module.exports = {
    get,
    has,
    invoke,
    isPlainFunction,
    isPlainObject,
    isPromise,
    mapValues,
    matchPaths,
    merge,
    mergeValues,
    pickBy,
    removePaths,
    replacePaths,
    set,
    upperFirst
};
