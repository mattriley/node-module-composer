const composer = require('../');

module.exports = ({ test }) => {

    test('privates are are accessible internally with or without prefix', t => {
        const target = {
            mod: {
                _fun1: () => () => 1,
                fun2: ({ mod }) => () => mod.fun1(),
                fun3: ({ mod }) => () => mod._fun1()
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        t.equal(mod.fun2(), 1);
        t.equal(mod.fun3(), 1);
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
