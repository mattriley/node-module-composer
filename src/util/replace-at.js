const get = require('lodash/get');
const set = require('lodash/set');
const pick = require('lodash/pick');
const unset = require('lodash/unset');
const cloneDeep = require('./clone-deep');

module.exports = (obj, fromArray, toArray) => {

    const target = cloneDeep(obj);
    fromArray.forEach((from, i) => {
        const orig = get(obj, from);
        unset(target, from);
        set(target, toArray[i], orig);
    });
    return pick(target, ...toArray);

};
