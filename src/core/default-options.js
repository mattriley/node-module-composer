module.exports = () => {

    return {
        customiser: 'setup',
        depth: 1,
        flat: false,
        overrides: {},
        configAlias: ['constants'],
        freezeConfig: true,
        defaultConfig: {},
        config: {},
        extensions: true,
        compositionModule: true,
        publicPrefix: '$',
        privatePrefix: '_',
        functionAlias: [],
        moduleAlias: [],
        globalThis: globalThis
    };

};
