module.exports = ({ test, assert }) => composer => {

    test('accessing original target reference', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        assert.deepEqual(compose.target, target);
    });

    test('default composition is copy of target', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        assert.deepEqual(compose.modules.mod, target.mod);
        assert.notEqual(compose.modules, target);
    });

    test('target keys are NOT automatically added to dependencies list', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        assert.deepEqual(compose.dependencies, {});
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

    test('undefined deps', () => {
        const target = {
            mod1: { fun: () => () => 2 },
            mod2: { fun: ({ mod1 }) => () => mod1.fun() }
        };
        const { compose } = composer(target);
        const { mod1 } = compose('mod1', undefined);
        const { mod2 } = compose('mod2', { mod1 });
        assert.deepEqual(mod2.fun(), 2);
        assert.deepEqual(compose.dependencies, { mod1: [], mod2: ['mod1'] });
    });

    test('attempt to re-compose', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        compose('mod', {});
        assert.throws(() => compose('mod', {}), /^Error: mod is already composed$/);
    });

    test('invalid options', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        assert.throws(() => compose('mod', {}, { foo: 'bar', bar: 'foo' }), /^Error: Invalid option: foo, bar$/);
    });

};
