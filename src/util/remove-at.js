const unset = require('lodash/unset');
const cloneDeep = require('./clone-deep');

module.exports = (obj, paths) => {

    const target = cloneDeep(obj);
    paths.forEach(path => unset(target, path));
    return target;

};
