const composer = require('../');

module.exports = ({ test }) => {

    test('accepts single config as an option', t => {
        const config1 = { a: { b: 'B', c: 'c' } };
        const { compose, config } = composer({}, { config: config1 });
        t.equal(config, { a: { b: 'B', c: 'c' } });
        t.equal(compose.config, { a: { b: 'B', c: 'c' } });
    });

    test('merges config', t => {
        const config1 = { a: { b: 'B', c: 'c' } };
        const config2 = { a: { c: 'C', d: 'D' } };
        const { compose } = composer({}, { configs: [config1, config2] });
        t.equal(compose.config, { a: { b: 'B', c: 'C', d: 'D' } });
    });

};
