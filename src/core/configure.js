const util = require('./util');

module.exports = createComposer => (...configs) => {

    const flatConfigs = configs.filter(c => !!c).flatMap(c => Array.isArray(c) ? c : [c]);

    const config = flatConfigs.reduce((acc, c) => {
        const config = typeof c === 'function' ? c(acc) : c;
        return util.merge(acc, config);
    }, {});

    return createComposer(config);

};
