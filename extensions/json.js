const extensions = require('module-composer/src/extensions');

const json = session => () => {
    const { constants, primitiveState } = session;
    return JSON.stringify({ ...constants, ...primitiveState }, null, 4);
};

const session = { json };
module.exports = extensions.register({ session });
