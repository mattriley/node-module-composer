const composer = require('module-composer');

module.exports = ({ test }) => {

    test('deps are applied recursively within single module', t => {
        const target = {
            mod1: {
                fun: () => () => 1,
                modA: {
                    fun1: ({ mod1 }) => () => mod1.fun(),
                    fun2: ({ mod1 }) => () => mod1.modA.fun1()
                }
            }
        };
        const { compose } = composer(target);
        const { mod1 } = compose.deep('mod1');
        t.equal(mod1.modA.fun1(), 1);
        t.equal(mod1.modA.fun2(), 1);
    });

    test('deps are applied recursively across multiple modules', t => {
        const target = {
            mod1: { modA: { fun: () => () => 1 } },
            mod2: { modB: { fun: ({ mod1 }) => () => mod1.modA.fun() } }
        };
        const { compose } = composer(target);
        const { mod1 } = compose.deep('mod1');
        const { mod2 } = compose.deep('mod2', { mod1 });
        t.equal(mod2.modB.fun(), 1);
    });

};
