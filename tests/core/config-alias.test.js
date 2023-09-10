module.exports = ({ test, assert }) => composer => {

    test('no config alias', () => {
        const { config } = composer({}, { config: { a: 1 } });
        assert.deepEqual(config, { a: 1 });
    });

    test('config alias as string', () => {
        const { config, constants } = composer({}, { config: { a: 1 }, configAlias: 'constants' });
        assert.deepEqual(config, { a: 1 });
        assert.equal(constants, config);
    });

};
