const precompose = session => ({ key, deps, self, options }) => {
    const aliasByModule = session.setState({ [key]: options.moduleAlias });
    const selfAlias = Object.fromEntries(options.moduleAlias.map(alias => [alias, self]));
    const aliases = Object.fromEntries(Object.keys(deps ?? {}).flatMap(depKey => {
        const aliases = aliasByModule[depKey] ?? [];
        return aliases.map(alias => [alias, session.modules[depKey]]);
    }));
    return { deps: { ...deps, ...aliases, ...selfAlias } };
};

const postcompose = session => ({ target, options }) => {
    options.moduleAlias.forEach(alias => session.registerAlias(alias, target));
};

module.exports = { precompose, postcompose };
