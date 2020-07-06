const _ = require('lodash');
const flatten = require('flat');

module.exports = obj => {
    const product = Object.entries(flatten(obj)).reduce((acc, [key, val]) => {
        const path = key.split('.');
        const lastTwoAreSame = () => new Set(_.takeRight(path, 2)).size === 1;
        const shouldCollapse = path.length > 1 && lastTwoAreSame();
        const collapse = () => {
            const newPath = _.dropRight(path, 1); // remove the duplicate.
            Object.assign(val, _.get(obj, newPath)); // intentional mutation.
            return newPath;
        };
        const finalPath = shouldCollapse ? collapse() : path;
        return _.set(acc, finalPath, val);
    }, {});
    return Object.assign(obj, product);
};
