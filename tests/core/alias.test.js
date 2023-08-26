module.exports = ({ test, assert }) => composer => {

    test('accessing original target reference', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        const { mod, modz } = compose.opts({ alias: ['modz'] })('mod');
        assert.equal(modz, mod);
    });

};
