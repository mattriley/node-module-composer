module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/module-alias');

    test('module alias', () => {
        const modules = {
            mod1: {
                fun1: () => () => 1,
                fun2: ({ m1 }) => () => m1.fun1()
            },
            mod2: {
                fun3: ({ m1 }) => () => m1.fun1()
            }
        };
        const { compose } = composer(modules);
        const { mod1, m1 } = compose('mod1', {}, { moduleAlias: 'm1' });
        const { mod2 } = compose('mod2', { mod1 });
        assert.deepEqual(mod1, m1);
        assert.equal(mod2.fun3(), 1);
        assert.deepEqual(compose.dependencies, { mod1: [], mod2: ['mod1'] });
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
