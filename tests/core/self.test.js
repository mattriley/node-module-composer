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
                fun2: ({ self }) => () => self.fun1(),
                sub: {
                    fun3: ({ self }) => () => self.fun2()
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

};
