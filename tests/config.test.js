const composer = require('../');

module.exports = ({ test }) => {

    test('default config object', t => {
        const options = { defaultConfig: { a: 1 } };
        const { compose, config } = composer({}, options);
        t.equal(config, options.defaultConfig);
        t.isNot(config, options.defaultConfig);
        t.is(config, compose.config);
    });

    test('single config object', t => {
        const options = { config: { a: 1 } };
        const { compose, config } = composer({}, options);
        t.equal(config, options.config);
        t.isNot(config, options.config);
        t.is(config, compose.config);
    });

    test('multiple config objects are merged', t => {
        const options = {
            config: [
                { a: { b: 'B', c: 'c' } },
                { a: { c: 'C', d: 'D' } }
            ]
        };
        const { compose, config } = composer({}, options);
        const expected = { a: { b: 'B', c: 'C', d: 'D' } };
        t.equal(config, expected);
        t.is(config, compose.config);
    });

    test('multiple config objects including default config are merged', t => {
        const options = {
            defaultConfig: { a: { b: 'B', c: 'c' } },
            config: { a: { c: 'C', d: 'D' } }
        };
        const { compose, config } = composer({}, options);
        const expected = { a: { b: 'B', c: 'C', d: 'D' } };
        t.equal(config, expected);
        t.is(config, compose.config);
    });

    test('each method of accessing config', t => {
        const options = { config: { a: 1 } };
        const { compose, config } = composer({}, options);
        t.is(config, compose.config);
        t.is(compose.modules.config, config, 'config is automatically registered as a module');
    });

};
