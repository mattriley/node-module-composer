const isNode = globalThis.process?.release?.name === 'node';
const getPackageName = () => require(globalThis.process.cwd() + '/package.json').name;

module.exports = {
    compositionName: isNode ? getPackageName() : globalThis.process?.env?.PACKAGE_NAME,
    stats: true,
    depth: 1,
    customiser: 'setup',
    privatePrefix: '_',
    configKeys: ['defaultConfig', 'config', 'configs'],
    overrides: {}
};
