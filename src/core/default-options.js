module.exports = () => {

    return {
        core: {
            customiser: 'setup',
            depth: 1,
            flat: false,
            overrides: {},
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
