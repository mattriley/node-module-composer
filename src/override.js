const merge = require('lodash.merge');
const pick = require('lodash.pick');

module.exports = (obj, overrides) => {

    return merge(obj, pick(overrides, Object.keys(obj)));

};
