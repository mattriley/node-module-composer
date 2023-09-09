module.exports = ({ test, assert }) => composer => {

    test('overrides are accessible externally', () => {
        const target = {
            mod1: { fun: () => () => 1 },
            mod2: { fun: ({ mod1 }) => () => mod1.fun() }
        };
        const overrides = { mod1: { fun: () => 2 } };
        const { compose } = composer(target, { overrides });
        const { mod1 } = compose('mod1', {});
        const { mod2 } = compose('mod2', { mod1 });
        assert.deepEqual(mod2.fun(), 2);
        assert.deepEqual(compose.modules.mod1, mod1);
        assert.deepEqual(compose.modules.mod2, mod2);
        assert.deepEqual(compose.dependencies, { mod1: [], mod2: ['mod1'] });
    });

    test('overrides are accessible internally', () => {
        const target = {
            mod: {
                fun1: () => () => 1,
                fun2: ({ mod }) => () => mod.fun1()
            }
        };
        const overrides = { mod: { fun1: () => 2 } };
        const { compose } = composer(target, { overrides });
        const { mod } = compose('mod', {});
        assert.deepEqual(mod.fun2(), 2);
        assert.deepEqual(compose.modules.mod, mod);
        assert.deepEqual(compose.dependencies, { mod: [] });
    });

    test('option to override globally', () => {
        const target = {
            mod1: {
                fun: () => () => 1
            },
            mod2: {
                fun: ({ mod1 }) => () => mod1.fun()
            }
        };
        const overrides = {
            mod1: {
                fun: () => 2
            }
        };
        const { compose } = composer(target, { overrides });
        const { mod1 } = compose('mod1');
        const { mod2 } = compose('mod2', { mod1 });
        assert.deepEqual(mod2.fun(), 2);
        assert.deepEqual(compose.modules.mod1, mod1);
        assert.deepEqual(compose.modules.mod2, mod2);
        assert.deepEqual(compose.dependencies, { mod1: [], mod2: ['mod1'] });
    });

    test('option to override locally', () => {
        const target = {
            mod1: {
                fun: () => () => 1
            },
            mod2: {
                fun: ({ mod1 }) => () => mod1.fun()
            }
        };
        const overrides = { fun: () => 2 };
        const { compose } = composer(target);
        const { mod1 } = compose('mod1', {}, { overrides });
        const { mod2 } = compose('mod2', { mod1 });
        assert.deepEqual(mod2.fun(), 2);
        assert.deepEqual(compose.modules.mod1, mod1);
        assert.deepEqual(compose.modules.mod2, mod2);
        assert.deepEqual(compose.dependencies, { mod1: [], mod2: ['mod1'] });
    });

    test('option to override locally overrides globally', () => {
        const target = {
            mod: {
                fun: () => () => 0
            }
        };
        const globalOverrides = {
            mod: {
                fun: () => 1
            }
        };
        const localOverrides = {
            fun: () => 2
        };
        const { compose } = composer(target, { overrides: globalOverrides });
        const { mod } = compose('mod', {}, { overrides: localOverrides });
        assert.equal(mod.fun(), 2);
    });

};
