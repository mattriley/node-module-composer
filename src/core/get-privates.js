const util = require('./util');

module.exports = (targetModule, options) => {

    const { depth, publicPrefix, privatePrefix } = options;

    const getView = (prefix, cb) => {
        const matches = util.matchPaths(targetModule, cb, depth);
        const paths = matches.map(path => path.map(str => str.replace(prefix, '')));
        const view = util.replacePaths(targetModule, matches, paths);
        return [view, paths];
    };

    const [, markedPublicPaths] = getView(publicPrefix, key => key.startsWith(publicPrefix));
    const [, markedPrivatePaths] = getView(privatePrefix, key => key.startsWith(privatePrefix));
    const anyPublic = !!markedPublicPaths.length;
    const anyPrivate = !!markedPrivatePaths.length;

    const [, privatePaths] = anyPrivate ? getView(privatePrefix, key => key.startsWith(privatePrefix)) : anyPublic ? getView(publicPrefix, key => !key.startsWith(publicPrefix)) : getView(privatePrefix, () => false);

    return privatePaths;

};
