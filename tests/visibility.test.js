const composer = require('../');

module.exports = ({ test }) => {

    test('module can be accessed internally by name', t => {
        const target = {
            mod: {
                fun1: () => () => 1,
                fun2: ({ mod }) => () => mod.fun1()
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        t.equal(mod.fun2(), 1);
    });

    test('module can be accessed internally using self', t => {
        const target = {
            mod: {
                fun1: () => () => 1,
                fun2: ({ self }) => () => self.fun1()
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        t.equal(mod.fun2(), 1);
    });

    test('privates are are accessible internally without prefix', t => {
        const target = {
            mod: {
                _fun1: () => () => 1,
                fun2: ({ mod }) => () => mod.fun1(),
                sub: {
                    _fun1: () => () => 1,
                    fun2: ({ mod }) => () => mod.fun1()
                }
            }
        };
        const { compose } = composer(target);
        const { mod } = compose.deep('mod');
        t.equal(mod.fun2(), 1);
        t.equal(mod.sub.fun2(), 1);
    });

    test('privates are not accessible externally neither with or without prefix', t => {
        const target = {
            mod: {
                _fun1: () => () => 1,
                fun2: () => () => 2
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        t.equal(mod._fun1, undefined);
        t.equal(mod.fun1, undefined);
        t.is(mod, compose.modules.mod);
    });

};
