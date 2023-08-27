module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/module-alias');

    test('module aliases', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        const { mod, modz } = compose.opts({ moduleAlias: ['modz'] }).make('mod');
        assert.deepEqual(modz, mod);
    });

};
