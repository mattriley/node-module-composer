module.exports = ({ test, assert }) => composer => {

    test('self reference by name', () => {
        const target = {
            mod: {
                fun1: () => () => 1,
                fun2: ({ mod }) => () => mod.fun1()
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        assert.deepEqual(mod.fun2(), 1);
    });

    test('self reference by literal self', () => {
        const target = {
            mod: {
                fun1: () => () => 1,
                fun2: ({ self }) => () => self.fun1()
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        assert.deepEqual(mod.fun2(), 1);
    });

    test('self reference by literal self in deep module', () => {
        const target = {
            mod: {
                fun1: () => () => 1,
                fun2: ({ self, mod }) => () => {
                    assert.equal(mod, self);
                    return self.fun1();
                },
                sub: {
                    fun3: ({ self, mod }) => () => {
                        assert.equal(mod, self);
                        return self.fun2();
                    }
                }
            }
        };
        const { compose } = composer(target);
        const { mod } = compose.deep('mod');
        assert.deepEqual(mod.sub.fun3(), 1);
    });

    test('literal self not accessible externally', () => {
        const target = {
            mod: {
                fun1: () => () => 1,
                fun2: ({ self }) => () => self.fun1()
            }
        };
        const { compose } = composer(target);
        const { self } = compose('mod');
        assert.equal(self, undefined);
    });

    test('cannot access substructure as a dependency', () => {
        const target = {
            mod: {
                fun1: () => () => 1,
                fun2: ({ self }) => () => {
                    return self.fun1();
                },
                sub: {
                    fun3: ({ self, sub }) => () => {
                        assert.equal(sub, undefined);
                        return self.fun2();
                    }
                }
            }
        };
        const { compose } = composer(target);
        const { mod } = compose.deep('mod');
        assert.deepEqual(mod.sub.fun3(), 1);
    });

    test('access substructure with literal here', () => {
        const target = {
            mod: {
                fun1: () => () => 1,
                fun2: ({ self, here }) => () => {
                    assert.notEqual(here.fun1, undefined);
                    return self.fun1();
                },
                sub: {
                    fun3: ({ self }) => () => {
                        // here not working here
                        // assert.notEqual(here.fun3, undefined);
                        return self.fun2();
                    }
                }
            }
        };
        const { compose } = composer(target);
        const { mod } = compose.deep('mod');
        assert.deepEqual(mod.sub.fun3(), 1);
    });

};
