/* eslint-disable no-prototype-builtins */

const get = require('lodash/get');
const has = require('lodash/has');
const mapKeys = require('lodash/mapKeys');
const mapValues = require('lodash/mapValues');
const merge = require('lodash/merge');
const mergeWith = require('lodash/mergeWith');
const omit = require('lodash/omit');
const pickBy = require('lodash/pickBy');
const set = require('lodash/set');

const deepFreeze = require('../util/freeze-deep');
const flatMapKeys = require('../util/flat-map-keys');
const flattenObject = require('../util/flatten-object');
const invokeAtOrReturn = require('../util/invoke-at-or-return');
const invokeOrReturn = require('../util/invoke-or-return');
const isPlainFunction = require('../util/is-plain-function');
const isPlainObject = require('../util/is-plain-object');
const isPromise = require('../util/is-promise');
const matchPaths = require('../util/match-paths');
const pipeAssign = require('../util/pipe-assign');
const removeAt = require('../util/remove-at');
const replaceAt = require('../util/replace-at');

module.exports = {
    deepFreeze,
    flatMapKeys,
    flattenObject,
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
