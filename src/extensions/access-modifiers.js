const util = require('../core/util');

const precompose = session => ({ key, target, options }) => {
    const { depth, publicPrefix, privatePrefix } = options;

    const getView = (prefix, cb) => {
        const matches = util.matchPaths(target, cb, depth);
        const paths = matches.map(path => path.map(str => str.replace(prefix, '').trim()));
        const view = util.replaceAt(target, matches, paths);
        return [view, paths];
    };

    // Probe for presence
    const [, markedPublicPaths] = getView(publicPrefix, k => k.startsWith(publicPrefix));
    const [, markedPrivatePaths] = getView(privatePrefix, k => k.startsWith(privatePrefix));
    const anyPublic = markedPublicPaths.length > 0;
    const anyPrivate = markedPrivatePaths.length > 0;

    const pickPublicView = () => {
        if (anyPublic) {
            return getView(publicPrefix, k => k.startsWith(publicPrefix));
        }
        if (anyPrivate) {
            return getView(privatePrefix, k => !k.startsWith(privatePrefix));
        }
        return getView(publicPrefix, () => true);
    };

    const pickPrivateView = () => {
        if (anyPrivate && anyPublic) {
            return getView(
                privatePrefix,
                k => k.startsWith(privatePrefix) || !k.startsWith(publicPrefix)
            );
        }
        if (anyPrivate) {
            return getView(privatePrefix, k => k.startsWith(privatePrefix));
        }
        if (anyPublic) {
            return getView(publicPrefix, k => !k.startsWith(publicPrefix));
        }
        return getView(privatePrefix, () => false);
    };

    const [publicView] = pickPublicView();
    const [privateView, privatePaths] = pickPrivateView();

    session.setState({ [key]: { privatePaths } });

    return { target: util.merge({}, privateView, publicView) };
};

const postcompose = session => ({ key, target }) => {
    const { privatePaths } = session.getState()[key];
    return { target: util.removeAt(target, privatePaths) };
};

module.exports = { precompose, postcompose };
