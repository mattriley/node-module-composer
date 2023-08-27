const postcompose = session => ({ target, options }) => {
    [options.alias].flat().forEach(alias => session.registerAlias(alias, target));
};

module.exports = { postcompose };
