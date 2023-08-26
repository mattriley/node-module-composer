module.exports = ({ test, assert }) => composer => {

    test('accessing original target reference', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        const { mod, modz } = compose.opts({ alias: ['modz'] }).make('mod');
        assert.equal(modz, mod);
    });

};
