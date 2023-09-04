module.exports = ({ test, assert }) => composer => {

    test('deps are applied to nested modules', () => {
        const target = {
            mod1: { modA: { fun: () => () => 2 } },
            mod2: { modB: { fun: ({ mod1 }) => () => mod1.modA.fun() } }
        };
        const { compose } = composer(target);
        const { mod1 } = compose('mod1.modA', {});
        const { mod2 } = compose('mod2.modB', { mod1 });
        assert.deepEqual(mod2.modB.fun(), 2);
        assert.deepEqual(compose.dependencies, {
            'mod1': [],
            'mod1.modA': [],
            'mod2': [],
            'mod2.modB': ['mod1']
        });
    });

};
