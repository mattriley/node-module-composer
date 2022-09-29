const process = require('process');
const { name } = require(process.cwd() + '/package.json');

module.exports = {
    compositionName: name,
    stats: true,
    depth: 1,
    customiser: 'setup',
    privatePrefix: '_',
    configKeys: ['defaultConfig', 'config', 'configs'],
    overrides: {}
};
