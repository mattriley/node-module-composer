module.exports = ({ test, assert }) => composer => {

    test('customiser', () => {
        const customised = { foo: 1 };
        const target = {
            mod: { setup: () => () => customised }
        };
        const { compose } = composer(target);
        delete compose.modules.composition;
        const { mod } = compose('mod', {});
        assert.deepEqual(mod, customised);
        assert.deepEqual(compose.modules, { mod });
        assert.deepEqual(compose.dependencies, { mod: [] });
    });

    test('async customiser', async () => {
        const customised = { foo: 1 };
        const target = {
            mod: { setup: () => async () => customised }
        };
        const { compose } = composer(target);
        delete compose.modules.composition;
        const { mod } = await compose('mod', {});
        assert.deepEqual(mod, customised);
        assert.deepEqual(compose.modules, { mod });
        assert.deepEqual(compose.dependencies, { mod: [] });
    });

    test('customiser returns non-plain object', () => {
        const customised = [];
        const target = {
            mod: { setup: () => () => customised }
        };
        const { compose } = composer(target);
        assert.throws(() => compose('mod', {}), /^Error: mod.setup must return a plain object$/);
    });

};
