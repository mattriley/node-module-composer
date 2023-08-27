module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/module-alias');

    test('module aliases', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        const { mod, modz } = compose('mod', { moduleAlias: ['modz'] });
        assert.deepEqual(modz, mod);
    });

};
