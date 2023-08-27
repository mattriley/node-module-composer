module.exports = ({ test, assert }) => composer => {

    test('module aliases', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        const { mod, modz } = compose.opts({ alias: ['modz'] }).make('mod');
        assert.deepEqual(modz, mod);
    });

    test('function aliases', () => {
        const functionAlias = {
            Value: 'Val'
        };

        const target = { mod: { getValues: {} } };
        const { compose } = composer(target);
        const { mod } = compose.opts({ functionAlias })('mod');
        assert.equal(mod.getVals, mod.getValues);
    });

};
