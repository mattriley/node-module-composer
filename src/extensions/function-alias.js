const util = require('../core/util');

const precompose = () => ({ target, options }) => {
    const { functionAlias } = options;
    return util.flatMapKeys(target, (val, key) => {
        const aliasKeys = functionAlias.map(([from, to]) => key.replace(from, to));
        return [key, ...aliasKeys];
    });
};

module.exports = { precompose };
