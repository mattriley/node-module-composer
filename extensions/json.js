const extensions = require('module-composer/src/extensions');

const json = session => () => {
    const { constants, primitiveState } = session;
    return JSON.stringify({ ...constants, ...primitiveState }, null, 4);
};

const extension = {
    name: 'json',
    session: session => {
        return { json: json(session) };
    }
};

module.exports = extensions.register(extension);
