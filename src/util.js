const flattenDeep = require('lodash/flattenDeep');
const isFunction = require('lodash/isFunction');
const isPlainObject = require('lodash/isPlainObject');
const mapValues = require('lodash/mapValues');
const merge = require('lodash/merge');
const pick = require('lodash/pick');
const upperFirst = require('lodash/upperFirst');
const mermaid = require('./mermaid');
const isPlainFunction = val => isFunction(val) && !(val.prototype && val.prototype.constructor === val);
const override = (obj, overrides = {}) => merge(obj, pick(overrides, Object.keys(obj)));
const defaultCustomiser = () => m => m && isPlainFunction(m.setup) ? m.setup() : m;

module.exports = { defaultCustomiser, flattenDeep, isPlainFunction, isPlainObject, mapValues, merge, upperFirst, mermaid, override };
