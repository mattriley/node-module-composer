module.exports = ({ test, assert }) => composer => {

    test('nested module', () => {
        const target = {
            sup1: { mod1: { fun1: () => () => 1 } },
            sup2: { mod2: { fun2: ({ mod1 }) => () => mod1.fun1() } }
        };
        const { compose } = composer(target);
        const { mod1 } = compose('sup1.mod1', {});
        const { mod2 } = compose('sup2.mod2', { mod1 });
        assert.deepEqual(mod2.fun2(), 1);
        assert.deepEqual(compose.dependencies, {
            'mod1': [],
            'mod2': ['mod1']
        });
    });

};
