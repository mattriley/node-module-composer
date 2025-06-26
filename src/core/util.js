/* eslint-disable no-prototype-builtins */
const deepFreeze = require('../util/freeze-deep');
const flattenObject = require('../util/flatten-object');
const cloneDeep = require('../util/clone-deep');

const get = require('lodash/get');
const has = require('lodash/has');
const isFunction = require('lodash/isFunction');
const isPlainObject = require('lodash/isPlainObject');
const mapKeys = require('lodash/mapKeys');
const mapValues = require('lodash/mapValues');
const merge = require('lodash/merge');
const mergeWith = require('lodash/mergeWith');
const omit = require('lodash/omit');
const pick = require('lodash/pick');
const pickBy = require('lodash/pickBy');
const set = require('lodash/set');
const unset = require('lodash/unset');

const invokeOrReturn = (target, ...args) => target && isPlainFunction(target) ? target(...args) : target;
const invokeAtOrReturn = (obj, path, ...args) => invokeOrReturn(get(obj, path, obj), ...args);
const isPlainFunction = val => isFunction(val) && !val.hasOwnProperty('prototype');
const isPromise = val => val && typeof val.then == 'function';

const matchPaths = (obj, cb, depth, currentDepth = 0, currentPath = []) => {
    return Object.entries(obj).flatMap(([key, val]) => {
        const path = [...currentPath, key];
        const res1 = !isPlainObject(val) && cb(key) ? [path] : [];
        const res2 = isPlainObject(val) ? matchPaths(val, cb, depth, currentDepth + 1, path) : [];
        return [...res1, ...res2];
    });
};

const flatMapKeys = (obj, iteratee) => {
    return Object.fromEntries(Object.entries(obj).flatMap(([key, val]) => {
        return iteratee(val, key, obj).map(key => [key, val]);
    }));
};


const pipeAssign = (...funs) => {
    return funs.reduce((acc, fun) => ({ ...acc, ...invokeOrReturn(fun, acc) }), {});
};

const removeAt = (obj, paths) => {
    const target = cloneDeep(obj); // Use custom deep clone
    paths.forEach(path => unset(target, path)); // Remove specified paths
    return target;
};



const replaceAt = (obj, fromArray, toArray) => {
    const target = cloneDeep(obj);
    fromArray.forEach((from, i) => {
        const orig = get(obj, from);
        unset(target, from);
        set(target, toArray[i], orig);
    });
    return pick(target, ...toArray);
};

module.exports = {
    deepFreeze,
    flattenObject,
    flatMapKeys,
    get,
    has,
    invokeAtOrReturn,
    invokeOrReturn,
    isPlainFunction,
    isPlainObject,
    isPromise,
    mapKeys,
    mapValues,
    matchPaths,
    merge,
    mergeWith,
    omit,
    pickBy,
    pipeAssign,
    removeAt,
    replaceAt,
    set
};
