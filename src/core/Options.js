module.exports = () => {

    const core = {
        depth: 1,
        overrides: {},
        customiser: 'setup',
        configAlias: 'constants',
        freezeConfig: true,
        extensions: true
    };

    const extensions = {
        publicPrefix: '$',
        privatePrefix: '_',
        functionAlias: {},
        moduleAlias: []
    };

    return { ...core, ...extensions };

};
