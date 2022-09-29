const isNode = globalThis.process?.release?.name === 'node';
const getPackageName = () => require(require('process').cwd() + '/package.json').name;

module.exports = {
    compositionName: isNode ? getPackageName() : null,
    stats: true,
    depth: 1,
    customiser: 'setup',
    privatePrefix: '_',
    configKeys: ['defaultConfig', 'config', 'configs'],
    overrides: {}
};
