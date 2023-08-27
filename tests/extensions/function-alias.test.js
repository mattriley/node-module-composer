module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/function-alias');

    test('function alias', () => {
        const functionAlias = {
            Value: 'Val'
        };

        const target = { mod: { getValues: {} } };
        const { compose } = composer(target);
        const { mod } = compose.opts({ functionAlias })('mod');
        assert.equal(mod.getVals, mod.getValues);
    });

    test('function alias composer level options', () => {
        const functionAlias = {
            Value: 'Val'
        };

        const target = { mod: { getValues: {} } };
        const { compose } = composer(target, { functionAlias });
        const { mod } = compose('mod');
        assert.equal(mod.getVals, mod.getValues);
    });

};
