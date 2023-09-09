
const composeOptions = [
    'customiser',
    'depth',
    'flat',
    'overrides',
    'functionAlias',
    'moduleAlias',
    'privatePrefix',
    'publicPrefix'
];

const composerOptions = [
    ...composeOptions,
    'configAlias',
    'freezeConfig',
    'defaultConfig',
    'config',
    'extensions',
    'compositionModule',
    'globalThis'
];

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
