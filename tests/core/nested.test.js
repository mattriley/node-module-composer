module.exports = ({ test, assert }) => composer => {

    test('nested module', () => {
        const target = {
            sup1: { mod1: { fun1: () => () => 1 } },
            sup2: { mod2: { fun2: ({ sup1 }) => () => sup1.mod1.fun1() } }
        };
        const { compose } = composer(target);
        const { sup1 } = compose('sup1.mod1', {});
        const { sup2 } = compose('sup2.mod2', { sup1 });
        assert.deepEqual(sup2.mod2.fun2(), 1);
        assert.deepEqual(compose.dependencies, {
            sup1: [],
            sup2: [],
            'sup1.mod1': [],
            'sup2.mod2': ['sup1']
        });
    });

};
