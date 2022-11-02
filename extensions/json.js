const extensions = require('module-composer/src/extensions');

const json = {
    session: session => () => {
        const { constants, primitiveState } = session;
        return JSON.stringify({ ...constants, ...primitiveState }, null, 4);
    }
};

module.exports = extensions.register({ json });
