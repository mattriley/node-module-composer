module.exports = ({ test, assert }) => composer => {

    test('config object provided as an option', () => {
        const configs = [{ a: 1 }];
        const { compose, config } = composer({}, { config: configs[0] });
        assert.deepEqual(config, configs[0]);
        assert.notEqual(config, configs[0]);
        assert.equal(config, compose.config);
    });

    test('array of config provided as an option', () => {
        const configs = [{ a: 1 }];
        const { compose, config } = composer({}, { config: configs });
        assert.deepEqual(config, configs[0]);
        assert.notEqual(config, configs[0]);
        assert.equal(config, compose.config);
    });

    test('default config also provided as an option', () => {
        const defaultConfig = { a: 1 };
        const configs = [{ b: 2 }];
        const { config } = composer({}, { defaultConfig, config: configs });
        assert.deepEqual(config, { a: 1, b: 2 });
    });

    test('config object', () => {
        const configs = [{ a: 1 }];
        const { configure } = composer({});
        const { compose, config } = configure(configs[0]);
        assert.deepEqual(config, configs[0]);
        assert.notEqual(config, configs[0]);
        assert.equal(config, compose.config);
    });

    test('array of config', () => {
        const configs = [
            { a: { b: 'B', c: 'c' } },
            { a: { c: 'C', d: 'D' } }
        ];
        const { configure } = composer({});
        const { compose, config } = configure(configs);
        const expected = { a: { b: 'B', c: 'C', d: 'D' } };
        assert.deepEqual(config, expected);
        assert.equal(config, compose.config);
    });

    test('spread of config', () => {
        const configs = [
            { a: { b: 'B', c: 'c' } },
            { a: { c: 'C', d: 'D' } }
        ];
        const { configure } = composer({});
        const { compose, config } = configure(...configs);
        const expected = { a: { b: 'B', c: 'C', d: 'D' } };
        assert.deepEqual(config, expected);
        assert.equal(config, compose.config);
    });

    test('config function', () => {
        const configs = [
            { a: 1 },
            config => ({ b: config.a + 1 })
        ];
        const { configure } = composer({});
        const { compose, config } = configure(configs);
        const expected = { a: 1, b: 2 };
        assert.deepEqual(config, expected);
        assert.equal(config, compose.config);
    });

    test('config merge customiser', () => {
        const customizer = (objValue, srcValue) => {
            if (Array.isArray(objValue)) return objValue.concat(srcValue);
        };
        const configs = [
            { a: { arr: [1] } },
            { a: { arr: [2] } }
        ];
        const { configure } = composer({});
        const { compose, config } = configure.mergeWith(customizer, configs);
        const expected = { a: { arr: [1, 2] } };
        assert.deepEqual(config, expected);
        assert.equal(config, compose.config);
    });

    test('config merge customiser with spread', () => {
        const customizer = (objValue, srcValue) => {
            if (Array.isArray(objValue)) return objValue.concat(srcValue);
        };
        const configs = [
            { a: { arr: [1] } },
            { a: { arr: [2] } }
        ];
        const { configure } = composer({});
        const { compose, config } = configure.mergeWith(customizer, ...configs);
        const expected = { a: { arr: [1, 2] } };
        assert.deepEqual(config, expected);
        assert.equal(config, compose.config);
    });

    test('module named config', () => {
        const configs = [{ a: 1 }];
        const target = { config: { a: 2 } };
        const { configure } = composer(target);
        const { compose } = configure(configs);
        assert.deepEqual(compose.modules.config, target.config);
    });

    test('module named config', () => {
        const configs = [{ a: 1 }];
        const target = { config: { a: 2 } };
        const { configure } = composer(target);
        const { compose } = configure(configs);
        assert.deepEqual(compose.modules.config, target.config);
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

    test('configure and configure.merge are the same', () => {
        const { configure } = composer({});
        assert.equal(configure.merge, configure);
    });

};
