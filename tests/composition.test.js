const composer = require('../');

module.exports = ({ test }) => {

    test('accessing original target reference', t => {
        const target = { mod: {} };
        const { compose } = composer(target);
        t.is(compose.target, target);
    });

    test('default composition is copy of target', t => {
        const target = { mod: {} };
        const { compose } = composer(target);
        t.equal(compose.modules, target);
        t.isNot(compose.modules, target);
        t.equal(compose.dependencies, { mod: [] });
    });

    test('composition overrides target', t => {
        const target = {
            mod1: { fun: () => () => 1 },
            mod2: {}
        };
        const { compose } = composer(target);
        const { mod1, mod2 } = compose('mod1');
        t.notEqual(mod1, target.mod1);
        t.is(mod2, target.mod2);
        t.equal(compose.dependencies, { mod1: [], mod2: [] });
    });

    test('deps are optional', t => {
        const target = { mod: { fun: () => () => 1 } };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        t.equal(mod.fun(), 1);
        t.equal(compose.dependencies, { mod: [] });
    });

    test('deps are applied', t => {
        const target = {
            mod1: { fun: () => () => 2 },
            mod2: { fun: ({ mod1 }) => () => mod1.fun() }
        };
        const { compose } = composer(target);
        const { mod1 } = compose('mod1');
        const { mod2 } = compose('mod2', { mod1 });
        t.equal(mod2.fun(), 2);
        t.equal(compose.dependencies, { mod1: [], mod2: ['mod1'] });
    });

    test('deps are applied to nested modules', t => {
        const target = {
            mod1: { modA: { fun: () => () => 2 } },
            mod2: { modB: { fun: ({ mod1 }) => () => mod1.modA.fun() } }
        };
        const { compose } = composer(target);
        const { mod1 } = compose('mod1.modA');
        const { mod2 } = compose('mod2.modB', { mod1 });
        t.equal(mod2.modB.fun(), 2);
        t.equal(compose.dependencies, {
            'mod1': [],
            'mod1.modA': [],
            'mod2': [],
            'mod2.modB': ['mod1']
        });
    });

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

    test('non-objects are returned as-is', t => {
        class Class {
            constructor() {
                t.fail('Shouldn\'t get here');
            }
        }
        const Prototype = function () {
            t.fail('Shouldn\'t get here');
        };
        Prototype.prototype = {};
        const target = {
            foo: {
                num: 1,
                str: 'str',
                bool: true,
                regex: /abc/,
                arr: [],
                arrOfObj: [{ foo: 'bar' }],
                Class,
                Prototype,
                null: null,
                undef: undefined
            }
        };
        const { compose } = composer(target);
        compose('foo');
        t.equal(compose.modules, target);
        t.equal(compose.dependencies, { foo: [] });
    });

};
