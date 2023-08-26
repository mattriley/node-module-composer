module.exports = ({ test, assert }) => composer => {

    test('accessing original target reference', () => {
        const target = { mod: {} };
        const options = { moduleAlias: { 'mod': 'modz' } };
        const { compose } = composer(target, options);
        const { mod, modz } = compose('mod');
        assert.equal(modz, mod);
    });

};
