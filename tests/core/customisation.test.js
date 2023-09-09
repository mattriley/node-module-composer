module.exports = ({ test, assert }) => composer => {

    test('customiser', () => {
        const customised = { foo: 1 };
        const target = {
            mod: { setup: () => () => customised }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod', {});
        assert.deepEqual(mod, customised);
        assert.deepEqual(compose.modules.mod, mod);
        assert.deepEqual(compose.dependencies, { mod: [] });
    });

    test('async customiser', async () => {
        const customised = { foo: 1 };
        const target = {
            mod: { setup: () => async () => customised }
        };
        const { compose } = composer(target);
        const { mod } = await compose('mod', {});
        assert.deepEqual(mod, customised);
        assert.deepEqual(compose.modules.mod, mod);
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

    test('option to customise customiser globally', () => {
        const customised = { foo: 1 };
        const target = {
            mod: {
                init: () => () => customised
            }
        };
        const { compose } = composer(target, { customiser: 'init' });
        const { mod } = compose('mod');
        assert.deepEqual(mod, customised);
    });

    test('option to customise customiser locally', () => {
        const customised = { foo: 1 };
        const target = {
            mod: {
                init: () => () => customised
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod', {}, { customiser: 'init' });
        assert.deepEqual(mod, customised);
    });

};
