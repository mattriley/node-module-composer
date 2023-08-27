const postcompose = session => ({ target, options }) => {
    const { moduleAlias = [] } = options;
    moduleAlias.flat().forEach(alias => session.registerAlias(alias, target));
};

module.exports = { postcompose };
