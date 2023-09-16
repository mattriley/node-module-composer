const precompose = () => ({ deps, options }) => {
    const { moduleAlias = [] } = options;
    const aliasDeps = [moduleAlias].flat().map(alias => ({ [alias]: {} }));
    return { deps: Object.assign({}, deps, ...aliasDeps) };
};

const postcompose = session => ({ target, options }) => {
    const { moduleAlias } = options;
    [moduleAlias].flat().forEach(alias => session.registerAlias(alias, target));
};

module.exports = { precompose, postcompose };
