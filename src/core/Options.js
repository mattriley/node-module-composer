module.exports = () => {
    return {
        depth: 1,
        customiser: 'setup',
        publicPrefix: '$',
        privatePrefix: '_',
        configOptionKeys: ['defaultConfig', 'config', 'configs'],
        overrides: {},
        extensions: false
    };
};
