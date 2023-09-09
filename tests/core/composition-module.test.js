module.exports = ({ test, assert }) => composer => {

    test('composition module', () => {
        const { compose } = composer({});
        const { composition } = compose.modules;
        assert.equal(composition, composition.modules.composition);
    });

    test('option to exclude composition module', () => {
        const { compose } = composer({}, { compositionModule: false });
        const { composition } = compose.modules;
        assert.equal(composition, undefined);
    });

    test('module named composition overrides composition module', () => {
        const target = {
            composition: {
                fun: () => () => 1
            }
        };
        const { compose } = composer(target);
        const { composition } = compose('composition');
        assert.equal(composition.fun(), 1);
    });

};
