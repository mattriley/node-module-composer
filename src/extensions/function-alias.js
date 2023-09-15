const util = require('../core/util');

const precompose = () => ({ target, options }) => {
    const { functionAlias } = options;
    const newTarget = util.flatMapKeys(target, (val, key) => {
        const aliasKeys = functionAlias.map(([from, to]) => key.replace(from, to));
        return [key, ...aliasKeys];
    });
    return { target: newTarget };
};

module.exports = { precompose };
