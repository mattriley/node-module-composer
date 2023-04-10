const composer = require('module-composer');
require('module-composer/extensions/access-modifiers');

module.exports = ({ test }) => {

    test('privates are accessible internally without prefix', t => {
        const target = {
            mod: {
                _fun1: () => () => 1,
                fun2: ({ mod }) => () => mod.fun1()
            }
        };
        const { compose } = composer(target, { extensions: ['access-modifiers'] });
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
        const { compose } = composer(target, { extensions: ['access-modifiers'] });
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
        const { compose } = composer(target, { extensions: ['access-modifiers'] });
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
        const { compose } = composer(target, { extensions: ['access-modifiers'] });
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
        const { compose } = composer(target, { extensions: ['access-modifiers'] });
        const { mod } = compose.deep('mod');
        t.equal(mod.sub.fun2(), 1);
    });

    // test('private namespaces', t => {
    //     const target = {
    //         mod: {
    //             _sub: {
    //                 fun1: () => () => 1 // not currently supported
    //             },
    //             fun2: ({ mod }) => () => mod.sub.fun1()
    //         }
    //     };
    //     const { compose } = composer(target);
    //     const { mod } = compose.deep('mod');

    //     t.equal(mod.fun2(), 1);
    // });

};
