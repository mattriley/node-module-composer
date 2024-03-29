module.exports = ({ test, assert }) => composer => {

    test('substructure is flattened', () => {
        const target = {
            mod: {
                sub1: { fun1: () => () => 1 },
                sub2: { fun2: () => () => 2 }
            }
        };
        const { compose } = composer(target);
        const { mod } = compose.flat('mod');
        assert.deepEqual(mod.fun1(), 1);
        assert.deepEqual(mod.fun2(), 2);
    });

    test('deps are flat', () => {
        const target = {
            mod: {
                sub1: {
                    fun1: () => () => 1,
                    fun2: ({ self, mod }) => () => {
                        assert.equal(self, mod);
                        return mod.fun1();
                    },
                    sub2: {
                        fun3: ({ self, mod }) => () => {
                            assert.equal(self, mod);
                            return mod.fun2();
                        }
                    }
                }
            }
        };
        const { compose } = composer(target);
        const { mod } = compose.flat('mod');
        assert.equal(mod.sub1, undefined);
        assert.deepEqual(mod.fun3(), 1);
    });

    test('collision', () => {
        const target = {
            mod: {
                sub1: {
                    fun: () => () => 1
                },
                sub2: {
                    fun: () => () => 2
                }
            }
        };
        const { compose } = composer(target);
        assert.throws(() => compose.flat('mod'), /^Error: Collision: fun$/);
    });

    // test('custom depth', { only: false }, () => {
    //     const fun = () => { };
    //     const target = {
    //         mod: {
    //             sub1: {
    //                 sub2: { fun }
    //             }
    //         }
    //     };
    //     const { compose } = composer(target, { depth: 1 });
    //     const { mod } = compose.flat('mod');
    //     console.warn({ mod });
    //     assert.deepEqual(mod.sub2.fun, fun);
    // });

};
