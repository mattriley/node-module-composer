/* eslint-disable no-prototype-builtins */
const cloneDeep = require('lodash/cloneDeep');
const get = require('lodash/get');
const has = require('lodash/has');
const isFunction = require('lodash/isFunction');
const isPlainObject = require('lodash/isPlainObject');
const mapKeys = require('lodash/mapKeys');
const mapValues = require('lodash/mapValues');
const merge = require('lodash/merge');
const mergeWith = require('lodash/mergeWith');
const pick = require('lodash/pick');
const pickBy = require('lodash/pickBy');
const set = require('lodash/set');
const unset = require('lodash/unset');
const flow = require('lodash/flow');
const omit = require('lodash/omit');

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

const replacePaths = (obj, fromArray, toArray) => {
    const target = cloneDeep(obj);
    fromArray.forEach((from, i) => {
        const orig = get(obj, from);
        unset(target, from);
        set(target, toArray[i], orig);
    });
    const pickKeys = toArray.map(arr => arr.join('.'));
    return pick(target, ...pickKeys);
};

const removePaths = (obj, paths) => {
    const target = cloneDeep(obj);
    paths.forEach(path => unset(target, path));
    return target;
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

const flat = (target, opts = {}) => {

    const { delimiter = '.', maxDepth = Infinity } = opts;
    const output = {}

    const step = (object, prev, currentDepth = 1) => {
        Object.keys(object).forEach(function (key) {
            const value = object[key]
            const type = Object.prototype.toString.call(value)
            const isobject = type === '[object Object]'
            const newKey = prev ? prev + delimiter + key : key

            if (isobject && Object.keys(value).length && (currentDepth < maxDepth)) {
                return step(value, newKey, currentDepth + 1)
            }

            output[newKey] = value
        })
    }

    step(target)

    return output
}


const invokeOrReturn = (target, ...args) => target && isPlainFunction(target) ? target(...args) : target;
const invokeAtOrReturn = (obj, path, ...args) => invokeOrReturn(get(obj, path, obj), ...args);

module.exports = {
    cloneDeep,
    deepFreeze,
    flat,
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
    pick,
    pickBy,
    removePaths,
    replacePaths,
    set
};
