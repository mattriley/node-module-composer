const util = require('./util');

module.exports = createComposer => (configs = [], customiser) => {

    const config = configs.reduce((acc, c) => {
        const config = util.isPlainFunction(c) ? c(acc) : c;
        return util.merge(acc, config, customiser);
    }, {});

    return createComposer(config);

};
