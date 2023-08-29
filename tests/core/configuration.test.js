module.exports = ({ test, assert }) => composer => {

    test('single config object', () => {
        const configs = [{ a: 1 }];
        const { configure } = composer({});
        const { compose, constants } = configure(configs);
        assert.deepEqual(constants, configs[0]);
        assert.notEqual(constants, configs[0]);
        assert.deepEqual(constants, compose.constants);
    });

    test('merging config', () => {
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

    test('merging config customiser', () => {
        const customizer = (objValue, srcValue) => {
            if (Array.isArray(objValue)) return objValue.concat(srcValue);
        };
        const configs = [
            { a: { arr: [1] } },
            { a: { arr: [2] } }
        ];
        const { configure } = composer({});
        const { compose, constants } = configure(configs, customizer);
        const expected = { a: { arr: [1, 2] } };
        assert.deepEqual(constants, expected);
        assert.equal(constants, compose.constants);
    });

    test('config functions', () => {
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

    test('module named config', () => {
        const configs = [{ a: 1 }];
        const target = { config: { a: 2 } };
        const { configure } = composer(target);
        const { compose } = configure(configs);
        assert.deepEqual(compose.modules.config, target.config);
    });

    test('module named constants', () => {
        const configs = [{ a: 1 }];
        const target = { constants: { a: 2 } };
        const { configure } = composer(target);
        const { compose } = configure(configs);
        assert.deepEqual(compose.modules.constants, target.constants);
    });

    test('config is frozen by default', () => {
        const configs = [{ a: 1 }];
        const { configure } = composer({});
        const { config } = configure(configs);
        config.a = 2;
        assert.equal(config.a, 1);
    });

    test('option to not freeze config', () => {
        const configs = [{ a: 1 }];
        const { configure } = composer({}, { freezeConfig: false });
        const { config } = configure(configs);
        config.a = 2;
        assert.equal(config.a, 2);
    });

};
