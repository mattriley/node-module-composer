module.exports = ({ test, assert }) => composer => {

    test('accessing original target reference', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        const { mod, modz } = compose('mod', {}, { alias: ['modz'] });
        assert.equal(modz, mod);
    });

};
