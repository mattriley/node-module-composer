const composeDefaultOptions = {
    customiser: 'setup',
    depth: 1,
    flat: false,
    overrides: {},
    publicPrefix: '$',
    privatePrefix: '_',
    functionAlias: [],
    moduleAlias: []
};

const composerDefaultOptions = {
    ...composeDefaultOptions,
    configAlias: ['constants'],
    freezeConfig: true,
    defaultConfig: {},
    config: {},
    extensions: true,
    compositionModule: true,
    globalThis: globalThis
};

module.exports = { composeDefaultOptions, composerDefaultOptions };
