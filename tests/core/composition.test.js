module.exports = ({ test, assert }) => composer => {

    test('accessing original target reference', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        assert.deepEqual(compose.target, target);
    });

    test('default composition is copy of target', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        assert.deepEqual(compose.modules, target);
        assert.notEqual(compose.modules, target);
    });

    test('target keys are automatically added to dependencies list', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        assert.deepEqual(compose.dependencies, { mod: [] });
    });

    test('target keys are omitted from composed dependencies list', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        assert.deepEqual(compose.composedDependencies, {});
    });

    test('target keys that are not plain objects are omitted from dependencies list', () => {
        const target = { mod: 1 };
        const { compose } = composer(target);
        assert.deepEqual(compose.dependencies, {});
    });

    test('composition overrides target', () => {
        const target = {
            mod1: { fun: () => () => 1 },
            mod2: {}
        };
        const { compose } = composer(target);
        const { mod1, mod2 } = compose('mod1');
        assert.notEqual(mod1, target.mod1);
        assert.deepEqual(mod2, target.mod2);
        assert.deepEqual(compose.dependencies, { mod1: [], mod2: [] });
    });

    test('deps are optional', () => {
        const target = { mod: { fun: () => () => 1 } };
        const { compose } = composer(target);
        const { mod } = compose('mod', {});
        assert.deepEqual(mod.fun(), 1);
        assert.deepEqual(compose.dependencies, { mod: [] });
    });

    test('deps are applied', () => {
        const target = {
            mod1: { fun: () => () => 2 },
            mod2: { fun: ({ mod1 }) => () => mod1.fun() }
        };
        const { compose } = composer(target);
        const { mod1 } = compose('mod1', {});
        const { mod2 } = compose('mod2', { mod1 });
        assert.deepEqual(mod2.fun(), 2);
        assert.deepEqual(compose.dependencies, { mod1: [], mod2: ['mod1'] });
    });

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
