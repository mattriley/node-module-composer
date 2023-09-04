module.exports = ({ test, assert }) => composer => {

    test('deep module', () => {
        const target = {
            mod1: {
                sub: {
                    fun: () => () => 'foobar'
                }
            },
            mod2: {
                sub: {
                    fun: ({ mod1 }) => () => mod1.sub.fun()
                }
            }
        };
        const { compose } = composer(target);
        const { mod1 } = compose.deep('mod1', {});
        const { mod2 } = compose.deep('mod2', { mod1 });
        assert.deepEqual(mod1.sub.fun(), 'foobar');
        assert.deepEqual(mod2.sub.fun(), 'foobar');
    });

    test('custom depth', () => {
        const fun = () => { };
        const target = {
            mod1: {
                mod2: {
                    mod3: { fun }
                }
            }
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
        assert.deepEqual(mod.sub.fun2(), 'foobar');
    });

};
