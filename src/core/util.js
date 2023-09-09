/* eslint-disable no-prototype-builtins */
const cloneDeep = require('lodash/cloneDeep');
const flow = require('lodash/flow');
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

const deepFreeze = obj => {
    const propNames = Reflect.ownKeys(obj);
    for (const name of propNames) {
        const value = obj[name];
        if ((value && typeof value === 'object') || typeof value === 'function') deepFreeze(value);
    }
    return Object.freeze(obj);
};

const flatMapKeys = (obj, iteratee) => {
    return Object.fromEntries(Object.entries(obj).flatMap(([key, val]) => {
        return iteratee(val, key, obj).map(key => [key, val]);
    }));
};

const flattenObject = (obj, opts = {}) => {
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

const removeAt = (obj, paths) => {
    const target = cloneDeep(obj);
    paths.forEach(path => unset(target, path));
    return target;
};

const replaceAt = (obj, fromArray, toArray) => {
    const target = cloneDeep(obj);
    fromArray.forEach((from, i) => {
        const orig = get(obj, from);
        unset(target, from);
        set(target, toArray[i], orig);
    });
    const pickKeys = toArray.map(arr => arr.join('.'));
    return pick(target, ...pickKeys);
};

module.exports = {
    cloneDeep,
    deepFreeze,
    flattenObject,
    flatMapKeys,
    flow,
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
    removeAt,
    replaceAt,
    set
};
