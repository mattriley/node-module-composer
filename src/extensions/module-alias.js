const precompose = session => ({ key, deps, self, options }) => {
    const moduleAlias = [options.moduleAlias ?? []].flat();
    const aliasByModule = session.setState({ [key]: moduleAlias });
    const selfAlias = Object.fromEntries(moduleAlias.map(alias => [alias, self]));
    const aliases = Object.keys(deps ?? {}).reduce((acc, depKey) => {
        const aliases = aliasByModule[depKey] ?? [];
        aliases.forEach(alias => acc[alias] = session.modules[depKey]);
        return acc;
    }, {});
    return { deps: { ...deps, ...aliases, ...selfAlias } };
};

const postcompose = session => ({ target, options }) => {
    const moduleAlias = [options.moduleAlias ?? []].flat();
    [moduleAlias].flat().forEach(alias => session.registerAlias(alias, target));
};

module.exports = { precompose, postcompose };
