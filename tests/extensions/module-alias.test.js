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

    test('option to set module alias globally', () => {
        const target = { mod: {} };
        const moduleAlias = {
            mod: ['modz']
        };
        const { compose } = composer(target, { moduleAlias });
        const { mod, modz } = compose('mod');
        assert.deepEqual(modz, mod);
    });

};
