module.exports = ({ test, assert }) => composer => {

    test('deep single module', () => {
        const target = {
            mod1: {
                fun: () => () => 1,
                modA: {
                    fun1: ({ mod1 }) => () => mod1.fun(),
                    fun2: ({ mod1 }) => () => mod1.modA.fun1()
                }
            }
        };
        const { compose } = composer(target);
        const { mod1 } = compose.deep('mod1', {});
        assert.deepEqual(mod1.modA.fun1(), 1);
        assert.deepEqual(mod1.modA.fun2(), 1);
    });

    test('deep multiple modules', () => {
        const target = {
            mod1: { modA: { fun: () => () => 1 } },
            mod2: { modB: { fun: ({ mod1 }) => () => mod1.modA.fun() } }
        };
        const { compose } = composer(target);
        const { mod1 } = compose.deep('mod1', {});
        const { mod2 } = compose.deep('mod2', { mod1 });
        assert.deepEqual(mod2.modB.fun(), 1);
    });

    test('custom depth', () => {
        const fun = () => { };
        const target = {
            mod1: { mod2: { mod3: { fun } } }
        };
        const { compose } = composer(target, { depth: 1 });
        const { mod1 } = compose('mod1', {});
        assert.deepEqual(mod1.mod2.mod3.fun, fun);
    });

    test('self at depth', () => {
        const target = {
            mod: {
                sub: {
                    fun1: ({ self }) => () => self.sub.fun2(),
                    fun2: () => () => 'foobar'
                }
            }
        };
        const { compose } = composer(target);
        const { mod } = compose.deep('mod', {});
        assert.deepEqual(mod.sub.fun1(), 'foobar');
    });

};
