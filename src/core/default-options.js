module.exports = () => {

    const compose = {
        core: {
            depth: 1,
            overrides: {},
            customiser: 'setup'
        },
        extensions: {
            publicPrefix: '$',
            privatePrefix: '_',
            functionAlias: {},
            moduleAlias: []
        }
    };

    const composer = {
        core: {
            ...compose.core,
            configAlias: ['constants'],
            freezeConfig: true,
            defaultConfig: {},
            config: {},
            extensions: true,
            compositionModule: true
        },
        extensions: {
            ...compose.extensions,
            globalThis: globalThis
        }
    };

    return { compose, composer };

};
