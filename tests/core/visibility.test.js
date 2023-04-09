const composer = require('module-composer');

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

    test('privates are accessible internally without prefix', t => {
        const target = {
            mod: {
                _fun1: () => () => 1,
                fun2: ({ mod }) => () => mod.fun1()
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        t.equal(mod.fun2(), 1);
    });

    test('privates are are accessible internally deeply without prefix', t => {
        const target = {
            mod: {
                sub: {
                    _fun1: () => () => 1,
                    fun2: ({ mod }) => () => mod.sub.fun1()
                }
            }
        };
        const { compose } = composer(target);
        const { mod } = compose.deep('mod');
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

    test('accessibility of publics', t => {
        const target = {
            mod: {
                _fun1: () => () => 1,
                fun2: () => () => 2,
                $fun3: () => () => 3
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        t.equal(mod._fun1, undefined);
        t.equal(mod.fun1, undefined);
        t.equal(mod.fun2, undefined);
        t.equal(typeof mod.fun3, 'function');
        t.is(mod, compose.modules.mod);
    });

    test('privates are are accessible internally deeply without prefix when mixed with publics', t => {
        const target = {
            mod: {
                sub: {
                    _fun1: () => () => 1,
                    $fun2: ({ mod }) => () => mod.sub.fun1()
                }
            }
        };
        const { compose } = composer(target);
        const { mod } = compose.deep('mod');
        t.equal(mod.sub.fun2(), 1);
    });

};
