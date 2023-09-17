module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/module-alias');

    test('module alias', async t => {
        const modules = {
            mod1: {
                fun1: () => () => 1,
                fun2: ({ m1 }) => () => m1.fun1()
            },
            mod2: {
                fun3: ({ m1 }) => () => m1.fun1()
            }
        };

        const next = compose => {
            const { m1, mod1 } = compose.modules;
            const { mod2 } = compose('mod2', { mod1 });
            assert.deepEqual(mod1, m1);
            assert.equal(mod2.fun3(), 1);
            assert.deepEqual(compose.dependencies, { mod1: [], mod2: ['mod1'] });
        };

        await t.test('string as compose option', () => {
            const { compose } = composer(modules);
            compose('mod1', {}, { moduleAlias: 'm1' });
            next(compose);
        });

        await t.test('array as compose option', () => {
            const { compose } = composer(modules);
            compose('mod1', {}, { moduleAlias: ['m1'] });
            next(compose);
        });

        await t.test('string as composer option', () => {
            const moduleAlias = { mod1: 'm1' };
            const { compose } = composer(modules, { moduleAlias });
            compose('mod1');
            next(compose);
        });

        await t.test('string as composer option', () => {
            const moduleAlias = { mod1: 'm1' };
            const { compose } = composer(modules, { moduleAlias });
            compose('mod1');
            next(compose);
        });
    });




};
