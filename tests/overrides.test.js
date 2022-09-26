const composer = require('../');

module.exports = ({ test }) => {

    test('overrides are accessible externally', t => {
        const target = {
            mod1: { fun: () => () => 1 },
            mod2: { fun: ({ mod1 }) => () => mod1.fun() }
        };
        const overrides = { mod1: { fun: () => 2 } };
        const { compose } = composer(target, { overrides });
        const { mod1 } = compose('mod1');
        const { mod2 } = compose('mod2', { mod1 });
        t.equal(mod2.fun(), 2);
        t.equal(compose.modules, { mod1, mod2 });
        t.equal(compose.dependencies, { mod1: [], mod2: ['mod1'] });
    });

    test('overrides are accessible internally', t => {
        const target = {
            mod: {
                fun1: () => () => 1,
                fun2: ({ mod }) => () => mod.fun1()
            }
        };
        const overrides = { mod: { fun1: () => 2 } };
        const { compose } = composer(target, { overrides });
        const { mod } = compose('mod');
        t.equal(mod.fun2(), 2);
        t.equal(compose.modules, { mod });
        t.equal(compose.dependencies, { mod: [] });
    });

};
