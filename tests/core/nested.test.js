module.exports = ({ test, assert }) => composer => {

    test('nested module', () => {
        const target = {
            mod1: { sub1: { fun: () => () => 2 } },
            mod2: { sub2: { fun: ({ mod1 }) => () => mod1.sub1.fun() } }
        };
        const { compose } = composer(target);
        const { mod1 } = compose('mod1.sub1', {});
        const { mod2 } = compose('mod2.sub2', { mod1 });
        assert.deepEqual(mod2.sub2.fun(), 2);
        assert.deepEqual(compose.dependencies, {
            'mod1': [],
            'mod1.sub1': [],
            'mod2': [],
            'mod2.sub2': ['mod1']
        });
    });

};
