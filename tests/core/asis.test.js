module.exports = ({ test, assert }) => composer => {

    test('compose as-is using asis function', () => {
        const target = {
            mod: {
                fun: () => 1
            }
        };
        const { compose } = composer(target);
        const { mod } = compose.asis('mod');
        assert.deepEqual(mod.fun(), 1);
    });


    test('compose as-is using depth of zero', () => {
        const target = {
            mod: {
                fun: () => 1
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod', null, { depth: 0 });
        assert.deepEqual(mod.fun(), 1);
    });

    test('compose as-is with unexpected deps', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        assert.throws(() => compose('mod', {}, { depth: 0 }), /^Error: Unexpected deps$/);
    });

    test('compose as-is with customisation', () => {
        const customised = { foo: 1 };
        const target = {
            mod: { setup: () => customised }
        };
        const { compose } = composer(target);
        const { mod } = compose.asis('mod');
        assert.deepEqual(mod, customised);
        assert.deepEqual(compose.modules.mod, mod);
        assert.deepEqual(compose.dependencies, { mod: [] });
    });

};
