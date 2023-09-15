module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/function-alias');

    test('function alias string literal', () => {
        const functionAlias = [
            ['Value', 'Val']
        ];
        const target = { mod: { getValues: {} } };
        const { compose } = composer(target);
        const { mod } = compose('mod', { functionAlias });
        assert.equal(mod.getVals, mod.getValues);
    });

    test('function alias regex', () => {
        const functionAlias = [
            [/Value/, 'Val']
        ];
        const target = { mod: { getValues: {} } };
        const { compose } = composer(target);
        const { mod } = compose('mod', { functionAlias });
        assert.equal(mod.getVals, mod.getValues);
    });

    test('function alias composer level options', () => {
        const functionAlias = [
            ['Value', 'Val']
        ];
        const target = { mod: { getValues: {} } };
        const { compose } = composer(target, { functionAlias });
        const { mod } = compose('mod', {});
        assert.equal(mod.getVals, mod.getValues);
    });

    test('function alias used internally', () => {
        const modules = {
            mod: {
                fun1: ({ mod }) => () => mod.getVal(),
                getValue: () => () => 1
            }
        };

        const functionAlias = [
            ['Value', 'Val']
        ];

        const { compose } = composer(modules);
        const { mod } = compose('mod', {}, { functionAlias });
        assert.equal(mod.fun1(), 1);
    });

};
