const precompose = session => ({ key, deps, self, options }) => {
    const moduleAlias = [options.moduleAlias ?? []].flat();
    const aliasByModule = session.setState({ [key]: moduleAlias });
    const selfAlias = Object.fromEntries(moduleAlias.map(alias => [alias, self]));
    const aliases = Object.keys(deps ?? {}).reduce((acc, key) => {
        const aliases = aliasByModule[key] ?? [];
        aliases.forEach(alias => acc[alias] = session.modules[key]);
        return acc;
    }, {});
    return { deps: { ...deps, ...aliases, ...selfAlias } };
};

const postcompose = session => ({ target, options }) => {
    const moduleAlias = [options.moduleAlias ?? []].flat();
    [moduleAlias].flat().forEach(alias => session.registerAlias(alias, target));
};

module.exports = { precompose, postcompose };
