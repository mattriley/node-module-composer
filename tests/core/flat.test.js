module.exports = ({ test, assert }) => composer => {

    test('substructure is flattened', () => {
        const target = {
            foobar: {
                sub1: { fun1: () => () => 1 },
                sub2: { fun2: () => () => 2 }
            }
        };
        const { compose } = composer(target);
        const { foobar } = compose.flat('foobar');
        assert.deepEqual(foobar.fun1(), 1);
        assert.deepEqual(foobar.fun2(), 2);
    });

    test('deps are flat', () => {
        const target = {
            foobar: {
                sub1: {
                    fun1: () => () => 1,
                    fun2: ({ self, foobar }) => () => {
                        assert.equal(self, foobar)
                        return foobar.fun1();
                    },
                    sub2: {
                        fun3: ({ self, foobar }) => () => {
                            assert.equal(self, foobar)
                            return foobar.fun2();
                        }
                    }
                },
            }
        };
        const { compose } = composer(target);
        const { foobar } = compose.flat('foobar');
        assert.deepEqual(foobar.fun3(), 1);
    });

};
