const composer = require('../');

module.exports = ({ test }) => {

    test('can get target', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        t.equal(compose.target, target);
    });

    test('accepts single config as an option', t => {
        const config1 = { a: { b: 'B', c: 'c' } };
        const { compose, config } = composer({}, { config: config1 });
        t.equal(config, { a: { b: 'B', c: 'c' } });
        t.equal(compose.config, { a: { b: 'B', c: 'c' } });
    });

    test('merges config', t => {
        const config1 = { a: { b: 'B', c: 'c' } };
        const config2 = { a: { c: 'C', d: 'D' } };
        const { compose } = composer({}, { configs: [config1, config2] });
        t.equal(compose.config, { a: { b: 'B', c: 'C', d: 'D' } });
    });

    test('target module unchanged if not composed', t => {
        const target = { foo: {}, bar: {} };
        const { compose } = composer(target);
        compose('foo');
        t.equal(compose.modules, { foo: {}, bar: {} });
        t.equal(compose.dependencies, { foo: [], bar: [] });
    });

    test('key not provided', t => {
        const target = {};
        const { compose } = composer(target);
        t.throws(() => compose(), 'key is required');
    });

    test('key not found', t => {
        const target = {};
        const { compose } = composer(target);
        t.throws(() => compose('foo'), 'foo not found');
        t.throws(() => compose('foo.bar'), 'foo.bar not found');
    });

    test('already composed', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose('foo');
        t.throws(() => compose('foo'), 'foo already composed');
    });

    test('composition ended', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose('foo');
        const composition = compose.end();
        t.equal(composition.modules, { foo: {} });
        t.throws(() => compose('bar'), 'Composition has ended');
    });

    test('composition already ended', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose.end();
        t.throws(() => compose.end(), 'Composition has already ended');
    });

    test('args are optional', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose('foo');
        t.equal(compose.modules, { foo: {} });
        t.equal(compose.dependencies, { foo: [] });
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
