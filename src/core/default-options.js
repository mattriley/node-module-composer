module.exports = () => {

    const core = {
        depth: 1,
        overrides: {},
        customiser: 'setup',
        configAlias: ['constants'],
        freezeConfig: true,
        defaultConfig: {},
        config: {},
        extensions: true,
        compositionModule: true
    };

    const extensions = {
        globalThis: globalThis,
        publicPrefix: '$',
        privatePrefix: '_',
        functionAlias: {},
        moduleAlias: []
    };

    return { ...core, ...extensions };

};
