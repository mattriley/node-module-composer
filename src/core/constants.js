
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

const composeOptions = Object.keys(composeDefaultOptions);


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

const composerOptions = Object.keys(composerDefaultOptions);


const defaultOptions = {
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

module.exports = { composeOptions, composerOptions, defaultOptions };
