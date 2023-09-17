module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/function-alias');

    test('function alias', async t => {
        const modules = {
            mod: {
                fun1: ({ mod }) => () => mod.getVal(),
                getValue: () => () => 1
            }
        };

        const next = compose => {
            const { mod } = compose.modules;
            assert.equal(mod.getVal(), mod.getValue());
            assert.equal(mod.fun1(), 1);
        };

        await t.test('compose option as string', () => {
            const functionAlias = [
                ['Value', 'Val']
            ];
            const { compose } = composer(modules);
            compose('mod', {}, { functionAlias });
            next(compose);
        });

        await t.test('compose option as regex', () => {
            const functionAlias = [
                [/Value/, 'Val']
            ];
            const { compose } = composer(modules);
            compose('mod', {}, { functionAlias });
            next(compose);
        });

        await t.test('defaults as string', () => {
            const functionAlias = [
                ['Value', 'Val']
            ];
            const defaults = { mod: { functionAlias } };
            const { compose } = composer(modules, { defaults });
            compose('mod');
            next(compose);
        });

        await t.test('defaults as string', () => {
            const functionAlias = [
                [/Value/, 'Val']
            ];
            const defaults = { mod: { functionAlias } };
            const { compose } = composer(modules, { defaults });
            compose('mod');
            next(compose);
        });

        await t.test('composer option as string', () => {
            const functionAlias = [
                ['Value', 'Val']
            ];
            const { compose } = composer(modules, { functionAlias });
            compose('mod');
            next(compose);
        });

        await t.test('composer option as regex', () => {
            const functionAlias = [
                [/Value/, 'Val']
            ];
            const { compose } = composer(modules, { functionAlias });
            compose('mod');
            next(compose);
        });
    });

};
