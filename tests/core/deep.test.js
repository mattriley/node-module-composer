module.exports = ({ test, assert }) => composer => {

    test('deep module', () => {
        const target = {
            mod1: {
                sub1: {
                    fun1: () => () => 1
                }
            },
            mod2: {
                sub2: {
                    fun2: ({ mod1 }) => () => mod1.sub1.fun1()
                }
            }
        };
        const { compose } = composer(target);
        const { mod1 } = compose.deep('mod1');
        const { mod2 } = compose.deep('mod2', { mod1 });
        assert.deepEqual(mod1.sub1.fun1(), 1);
        assert.deepEqual(mod2.sub2.fun2(), 1);
    });

    test('option to customise depth globally', () => {
        const target = {
            mod: {
                sub1: {
                    sub2: {
                        fun: () => 1
                    }
                }
            }
        };
        const { compose } = composer(target, { depth: 1 });
        const { mod } = compose('mod');
        assert.equal(mod.sub1.sub2.fun(), 1);
    });


    test('option to customise depth globally', () => {
        const target = {
            mod: {
                sub1: {
                    sub2: {
                        fun: () => 1
                    }
                }
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod', {}, { depth: 1 });
        assert.equal(mod.sub1.sub2.fun(), 1);
    });

};
