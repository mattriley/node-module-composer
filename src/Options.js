module.exports = () => {
    return {
        compositionName: undefined,
        depth: 1,
        customiser: 'setup',
        privatePrefix: '_',
        configOptionKeys: ['defaultConfig', 'config', 'configs'],
        compositionNameConfigKeys: ['compositionName', 'appName', 'displayName', 'packageName'],
        overrides: {}
    };
};
