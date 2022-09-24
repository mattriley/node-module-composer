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
        const target = { mod1: { fun: () => 1 }, mod2: {} };
        const { compose } = composer(target);
        const { mod1, mod2 } = compose('mod1');
        t.notEqual(mod1, target.mod1);
        t.is(mod2, target.mod2);
        t.equal(compose.dependencies, { mod1: [], mod2: [] });
    });

    test('deps are optional', t => {
        const target = { mod1: { fun: () => 1 } };
        const { compose } = composer(target);
        const { mod1 } = compose('mod1');
        t.equal(mod1, { fun: 1 });
        t.equal(compose.dependencies, { mod1: [] });
    });

    test('args are applied', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose('foo', { bar: {} });
        t.equal(compose.modules, { foo: {} });
        t.equal(compose.dependencies, { foo: ['bar'] });
    });

    test('args are applied to nested object', t => {
        const target = { foo: { bar: {} } };
        const { compose } = composer(target);
        compose('foo.bar', { baz: {} });
        t.equal(compose.modules, { foo: { bar: {} } });
        t.equal(compose.dependencies, { foo: [], 'foo.bar': ['baz'] });
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

    test('peer function is invoked with args', t => {
        let fun2Called = false;

        const target = {
            foo: {
                fun1: ({ foo }) => () => {
                    foo.fun2();
                },
                fun2: () => () => {
                    fun2Called = true;
                }
            }
        };

        const { compose } = composer(target);
        const { foo } = compose('foo');
        foo.fun1();
        t.ok(fun2Called);
    });

    test('nested function is invoked', t => {
        let fun2Called = false;

        const modules = {
            foo: {
                bar: {
                    fun2: () => () => {
                        fun2Called = true;
                    }
                },
                fun1: ({ foo }) => () => {
                    foo.bar.fun2();
                }
            }
        };

        const { compose } = composer(modules, { depth: 2 });
        const { foo } = compose('foo');
        foo.fun1();
        t.ok(fun2Called);
    });

};
