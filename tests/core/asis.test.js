module.exports = ({ test, assert }) => composer => {

    test('module is registered as-is', () => {
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
