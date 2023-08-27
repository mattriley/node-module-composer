const util = require('../core/util');

const flat = session => opts => {
    return (path, deps, args) => {
        const modules = util.get(session.target, path);
        const results = Object.keys(modules).map(key => util.get(session.compose(`${path}.${key}`, deps, args, opts), `${path}.${key}`));
        return util.set({}, path, Object.assign({}, ...results));
    };
};

module.exports = { flat };
