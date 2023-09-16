const precompose = () => ({ deps, self, options }) => {
    const { moduleAlias = [] } = options;
    const aliasDeps = Object.fromEntries([moduleAlias].flat().map(alias => [alias, self]));
    return { deps: { ...deps, ...aliasDeps } };
};

const postcompose = session => ({ target, options }) => {
    const { moduleAlias = [] } = options;
    [moduleAlias].flat().forEach(alias => session.registerAlias(alias, target));
};

module.exports = { precompose, postcompose };
