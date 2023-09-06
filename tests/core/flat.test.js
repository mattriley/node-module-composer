module.exports = ({ test, assert }) => composer => {

    test('submodules are flattened', () => {
        const target = {
            module: {
                mod1: { fun1: () => () => 1 },
                mod2: { fun2: () => () => 2 }
            }
        };
        const { compose } = composer(target);
        const { module } = compose.flat('module', {});
        const { fun1, fun2 } = module;
        assert.deepEqual(fun1(), 1);
        assert.deepEqual(fun2(), 2);
    });

    test('deps are flat', () => {
        const target = {
            module: {
                sub1: {
                    fun1: () => () => 1,
                    fun2: ({ self, module }) => () => {
                        assert.equal(self, module)
                        return module.fun1();
                    },
                    sub2: {
                        fun3: ({ self, module }) => () => {
                            assert.equal(self, module)
                            return module.fun2();
                        }
                    }
                },
            }
        };
        const { compose } = composer(target);
        const { module } = compose.flat('module', {});
        assert.deepEqual(module.fun3(), 1);
    });

};
