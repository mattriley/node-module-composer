const json = session => () => {
    const { constants, primitiveState } = session;
    return JSON.stringify({ ...constants, ...primitiveState }, null, 4);
};

module.exports = { json };
