const util = require('../core/util');

const postcompose = () => ({ target, options }) => {
    const { functionAlias } = options;
    return util.flatMapKeys(target, (val, key) => {
        const aliasKeys = Object.entries(functionAlias).map(([from, to]) => key.replace(from, to));
        return [key, ...aliasKeys];
    });
};

module.exports = { postcompose };
