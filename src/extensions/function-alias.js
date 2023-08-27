const util = require('../core/util');

const postcompose = () => ({ target, options }) => {

    return util.flatMapKeys(target, (val, key) => {
        const aliasKeys = Object.entries(options.functionAlias).map(([from, to]) => key.replace(from, to));
        return [key, ...aliasKeys];
    });
};

module.exports = { postcompose };
