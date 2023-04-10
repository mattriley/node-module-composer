const util = require('module-composer/src/core/util');

const precustomise = session => (path, target, options) => {
    const { depth, publicPrefix, privatePrefix } = options;

    const getView = (prefix, cb) => {
        const matches = util.matchPaths(target, cb, depth);
        const paths = matches.map(path => path.map(str => str.replace(prefix, '')));
        const view = util.replacePaths(target, matches, paths);
        return [view, paths];
    };

    const [, markedPublicPaths] = getView(publicPrefix, key => key.startsWith(publicPrefix));
    const [, markedPrivatePaths] = getView(privatePrefix, key => key.startsWith(privatePrefix));
    const anyPublic = !!markedPublicPaths.length;
    const anyPrivate = !!markedPrivatePaths.length;

    const [publicView] = anyPublic ? getView(publicPrefix, key => key.startsWith(publicPrefix)) : anyPrivate ? getView(privatePrefix, key => !key.startsWith(privatePrefix)) : getView(publicPrefix, () => true);
    const [privateView, privatePaths] = anyPrivate ? getView(privatePrefix, key => key.startsWith(privatePrefix)) : anyPublic ? getView(publicPrefix, key => !key.startsWith(publicPrefix)) : getView(privatePrefix, () => false);

    session.setState({ [path]: { privatePaths } });

    return util.merge({}, privateView, publicView);
};

const postcustomise = session => (path, target) => {
    const { privatePaths } = session.getState()[path];
    return util.removePaths(target, privatePaths);
};

module.exports = { precustomise, postcustomise };
