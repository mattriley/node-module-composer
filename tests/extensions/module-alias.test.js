module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/module-alias');

    test('module alias', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        const { mod, modz } = compose('mod', {}, { moduleAlias: 'modz' });
        assert.deepEqual(modz, mod);
    });

    test('array of module alias', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        const { mod, modz } = compose('mod', {}, { moduleAlias: ['modz'] });
        assert.deepEqual(modz, mod);
    });

};
