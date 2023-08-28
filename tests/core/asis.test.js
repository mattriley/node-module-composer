module.exports = ({ test, assert }) => composer => {

    test('compose as-is with no dependencies', () => {
        const target = {
            mod: {
                fun: () => 1
            }
        };
        const { compose } = composer(target);
        const { mod } = compose.asis('mod');
        assert.deepEqual(mod.fun(), 1);
    });

};
