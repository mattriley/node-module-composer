/* eslint-disable no-prototype-builtins */
const deepFreeze = require('../util/freeze-deep');
const flattenObject = require('../util/flatten-object');
const replaceAt = require('../util/replace-at');
const matchPaths = require('../util/match-paths');
const removeAt = require('../util/remove-at');

const get = require('lodash/get');
const has = require('lodash/has');
const isFunction = require('lodash/isFunction');
const isPlainObject = require('lodash/isPlainObject');
const mapKeys = require('lodash/mapKeys');
const mapValues = require('lodash/mapValues');
const merge = require('lodash/merge');
const mergeWith = require('lodash/mergeWith');
const omit = require('lodash/omit');
const pickBy = require('lodash/pickBy');
const set = require('lodash/set');
const unset = require('lodash/unset');

const invokeOrReturn = (target, ...args) => target && isPlainFunction(target) ? target(...args) : target;
const invokeAtOrReturn = (obj, path, ...args) => invokeOrReturn(get(obj, path, obj), ...args);
const isPlainFunction = val => isFunction(val) && !val.hasOwnProperty('prototype');
const isPromise = val => val && typeof val.then == 'function';



const flatMapKeys = (obj, iteratee) => {
    return Object.fromEntries(Object.entries(obj).flatMap(([key, val]) => {
        return iteratee(val, key, obj).map(key => [key, val]);
    }));
};


const pipeAssign = (...funs) => {
    return funs.reduce((acc, fun) => ({ ...acc, ...invokeOrReturn(fun, acc) }), {});
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
