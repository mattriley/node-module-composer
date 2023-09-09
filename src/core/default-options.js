module.exports = () => {

    return {
        core: {
            depth: 1,
            overrides: {},
            customiser: 'setup',
            configAlias: ['constants'],
            freezeConfig: true,
            defaultConfig: {},
            config: {},
            extensions: true,
            compositionModule: true
        },
        extensions: {
            publicPrefix: '$',
            privatePrefix: '_',
            functionAlias: {},
            moduleAlias: [],
            globalThis: globalThis
        }
    };

};
