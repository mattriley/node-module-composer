module.exports = ({ test, assert }) => composer => {

    test('compose as-is with no deps using asis', () => {
        const target = {
            mod: {
                fun: () => 1
            }
        };
        const { compose } = composer(target);
        const { mod } = compose.asis('mod');
        assert.deepEqual(mod.fun(), 1);
    });


    test('compose as-is with no deps using depth of zero', () => {
        const target = {
            mod: {
                fun: () => 1
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod', null, { depth: 0 });
        assert.deepEqual(mod.fun(), 1);
    });

    test('unexpected deps', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        assert.throws(() => compose('mod', {}, { depth: 0 }), /^Error: Unexpected deps$/);
    });

};
