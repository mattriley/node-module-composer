module.exports = ({ test, assert }) => composer => {

    test('module aliases', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        const { mod, modz } = compose.opts({ alias: ['modz'] }).make('mod');
        assert.equal(modz, mod);
    });


    test('function aliases', () => {
        const target = { mod: { getValues: {} } };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        assert.equal(mod.getVals, mod.getValues);
    });

};
