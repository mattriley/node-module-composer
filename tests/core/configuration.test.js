module.exports = ({ test, assert }) => composer => {

    test('single config object', () => {
        const configs = [{ a: 1 }];
        const { configure } = composer({});
        const { compose, constants } = configure(configs);
        assert.deepEqual(constants, configs[0]);
        assert.notEqual(constants, configs[0]);
        assert.deepEqual(constants, compose.constants);
    });

    test('multiple config objects are merged', () => {
        const configs = [
            { a: { b: 'B', c: 'c' } },
            { a: { c: 'C', d: 'D' } }
        ];
        const { configure } = composer({});
        const { compose, constants } = configure(configs);
        const expected = { a: { b: 'B', c: 'C', d: 'D' } };
        assert.deepEqual(constants, expected);
        assert.equal(constants, compose.constants);
    });

    test('config customisation', () => {
        const config = [
            { a: 1 },
            config => ({ b: config.a + 1 })
        ];
        const { configure } = composer({});
        const { compose, constants } = configure(config);
        const expected = { a: 1, b: 2 };
        assert.deepEqual(constants, expected);
        assert.equal(constants, compose.constants);
    });

    test('a module named constants overrides constants as a module', () => {
        const configs = [{ a: 1 }];
        const target = { config: { a: 2 } };
        const { configure } = composer(target);
        const { compose } = configure(configs);
        assert.deepEqual(compose.modules.constants, target.constants);
    });

    test('option to not freeze config', () => {
        const configs = [{ a: 1 }];
        const target = { config: { a: 2 } };
        const { configure } = composer(target, { freezeConfig: false });
        const { compose } = configure(configs);
        assert.deepEqual(compose.modules.constants, target.constants);
    });

};
