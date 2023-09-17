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
    moduleAlias: undefined,
    configAlias: [],
    freezeConfig: true,
    defaultConfig: {},
    config: {},
    extensions: true,
    compositionModule: true,
    globalThis: globalThis,
    defaults: {}
};

module.exports = { composeDefaultOptions, composerDefaultOptions };
