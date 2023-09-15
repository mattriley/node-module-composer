module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/function-alias');

    test('function alias string literal', () => {
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
        assert.equal(mod.getVal(), mod.getValue());
        assert.equal(mod.fun1(), 1);
    });

    test('function alias regex', () => {
        const modules = {
            mod: {
                fun1: ({ mod }) => () => mod.getVal(),
                getValue: () => () => 1
            }
        };
        const functionAlias = [
            [/Value/, 'Val']
        ];
        const { compose } = composer(modules);
        const { mod } = compose('mod', {}, { functionAlias });
        assert.equal(mod.getVal(), mod.getValue());
        assert.equal(mod.fun1(), 1);
    });

    test('function alias composer option', () => {
        const modules = {
            mod: {
                fun1: ({ mod }) => () => mod.getVal(),
                getValue: () => () => 1
            }
        };
        const functionAlias = [
            ['Value', 'Val']
        ];
        const { compose } = composer(modules, { functionAlias });
        const { mod } = compose('mod');
        assert.equal(mod.getVal(), mod.getValue());
        assert.equal(mod.fun1(), 1);
    });

};
