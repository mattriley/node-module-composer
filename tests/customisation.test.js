const composer = require('../');

module.exports = ({ test }) => {

    test('customiser', t => {
        const customised = { foo: 1 };
        const target = {
            mod: { setup: () => () => customised }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        t.equal(mod, customised);
        t.equal(compose.modules, { mod });
        t.equal(compose.dependencies, { mod: [] });
    });

    test('async customiser', async t => {
        const customised = { foo: 1 };
        const target = {
            mod: { setup: () => async () => customised }
        };
        const { compose } = composer(target);
        const { mod } = await compose('mod');
        t.equal(mod, customised);
        t.equal(compose.modules, { mod });
        t.equal(compose.dependencies, { mod: [] });
    });

    test('customiser returns non-plain object', t => {
        const customised = [];
        const target = {
            mod: { setup: () => () => customised }
        };
        const { compose } = composer(target);
        t.throws(() => compose('mod'), /^mod.setup must return a plain object$/);
    });

};
