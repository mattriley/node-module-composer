/* eslint-disable no-prototype-builtins */
const deepFreeze = require('../util/freeze-deep');
const flattenObject = require('../util/flatten-object');
const replaceAt = require('../util/replace-at');
const matchPaths = require('../util/match-paths');
const removeAt = require('../util/remove-at');
const pipeAssign = require('../util/pipe-assign');
const invokeOrReturn = require('../util/invoke-or-return');
const flatMapKeys = require('../util/flat-map-keys');
const isPromise = require('../util/is-promise');
const isPlainFunction = require('../util/is-plain-function');
const invokeAtOrReturn = require('../util/invoke-at-or-return');


const get = require('lodash/get');
const has = require('lodash/has');
const isPlainObject = require('lodash/isPlainObject');
const mapKeys = require('lodash/mapKeys');
const mapValues = require('lodash/mapValues');
const merge = require('lodash/merge');
const mergeWith = require('lodash/mergeWith');
const omit = require('lodash/omit');
const pickBy = require('lodash/pickBy');
const set = require('lodash/set');




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
