// const composer = require('module-composer');
const composer = require('../../src/core/composer');

module.exports = ({ test }) => {

    test('single config object', t => {
        const config = { a: 1 };
        const { configure } = composer({});
        const { compose, constants } = configure(config);
        t.equal(constants, config);
        t.isNot(constants, config);
        t.equal(constants, compose.constants);
    });

    test('multiple config objects are merged', t => {
        const config = [
            { a: { b: 'B', c: 'c' } },
            { a: { c: 'C', d: 'D' } }
        ];
        const { configure } = composer({});
        const { compose, constants } = configure(config);
        const expected = { a: { b: 'B', c: 'C', d: 'D' } };
        t.equal(constants, expected);
        t.is(constants, compose.constants);
    });

    test('config customisation', t => {
        const config = { a: 1 };
        const { configure } = composer({});
        const { compose, constants } = configure(config, config => ({ b: config.a + 1 }));
        const expected = { a: 1, b: 2 };
        t.equal(constants, expected);
        t.is(constants, compose.constants);
    });

    test('a module named constants overrides constants as a module', t => {
        const config = { a: 1 };
        const target = { config: { a: 2 } };
        const { configure } = composer(target);
        const { compose } = configure(config);
        t.equal(compose.modules.constants, target.constants);
    });

    test('option to not freeze config', t => {
        const config = { a: 1 };
        const target = { config: { a: 2 } };
        const { configure } = composer(target, { freezeConfig: false });
        const { compose } = configure(config);
        t.equal(compose.modules.constants, target.constants);
    });

};
