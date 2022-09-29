const isNode = globalThis.process?.release?.name === 'node';
const getPackageName = () => require(globalThis.process.cwd() + '/package.json').name;

module.exports = {
    compositionName: isNode ? getPackageName() : undefined,
    stats: true,
    depth: 1,
    customiser: 'setup',
    privatePrefix: '_',
    configKeys: ['defaultConfig', 'config', 'configs'],
    compositionNameConfigKeys: ['compositionName', 'appName', 'displayName', 'packageName'],
    overrides: {}
};
