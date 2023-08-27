module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/function-alias');

    test('function aliases', () => {
        const functionAlias = {
            Value: 'Val'
        };

        const target = { mod: { getValues: {} } };
        const { compose } = composer(target);
        const { mod } = compose.opts({ functionAlias })('mod');
        assert.equal(mod.getVals, mod.getValues);
    });

};
