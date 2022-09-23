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

    test('no stats when stats option is false', t => {
        const target = { foo: {} };
        const { compose } = composer(target, { stats: false });
        compose('foo');
        const composition = compose.end();
        t.notOk('stats' in composition);
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

    test('overrides are applied', t => {
        const target = { foo: {} };
        const overrides = { foo: { num: 1 } };
        const { compose } = composer(target, { overrides });
        compose('foo');
        t.equal(compose.modules, { foo: { num: 1 } });
        t.equal(compose.dependencies, { foo: [] });
    });

    test('default customiser is invoked', t => {
        const target = {
            foo: {
                setup: () => () => ({ bar: {} })
            }
        };
        const { compose } = composer(target);
        compose('foo', {});
        t.equal(compose.modules, { foo: { bar: {} } });
        t.equal(compose.dependencies, { foo: [] });
    });

    test('default customiser is invoked async', async t => {
        const target = {
            foo: {
                setup: () => async () => ({})
            }
        };
        const { compose } = composer(target);
        const modules = await compose('foo', {});
        t.equal(compose.modules, modules);
        t.equal(compose.modules, { foo: {} });
        t.equal(compose.dependencies, { foo: [] });
    });

    test('default customiser returns non-plain object', t => {
        const target = {
            foo: {
                setup: () => () => {
                    return [[1], [2]];
                }
            }
        };
        const { compose } = composer(target);
        t.throws(() => compose('foo', {}), 'key customiser must return plain object');
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

    test('privates', t => {
        const target = {
            foo: {
                fun1: () => () => {
                },
                _fun2: () => () => {
                }
            }
        };

        const { compose } = composer(target);
        const { foo } = compose('foo');
        t.notOk(foo._fun2);
        t.notOk(foo.fun2);
        t.notOk(compose.modules.foo._fun2);
        t.notOk(compose.modules.foo.fun2);
    });

    test('register unnamed composition', t => {
        const target = { foo: {}, window: {} };
        const { compose } = composer(target);
        compose('foo', { bar: {} });
        const composition = compose.end();
        const matchedComposition = globalThis.compositions.find(c => c === composition);
        t.equal(composition, matchedComposition);
        t.equal(matchedComposition.compositionName, undefined);
    });

    test('register named composition', t => {
        const target = { foo: {} };
        const { compose } = composer(target, { compositionName: 'foobar' });
        compose('foo', { bar: {} });
        const composition = compose.end();
        const matchedComposition = globalThis.compositions.find(c => c === composition);
        t.equal(composition, matchedComposition);
        t.equal(matchedComposition.compositionName, 'foobar');
    });

    test('mermaid', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose('foo', { bar: {} });
        t.equal(compose.mermaid(), 'graph TD;\n    foo-->bar;');
    });

    test('mermaid omit', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose('foo', { bar: {} });
        t.equal(compose.mermaid({ omit: ['foo'] }), 'graph TD;');
    });

    test('[WIP] eject', t => {
        const bar = {
            getBar: () => 'bar'
        };

        const target = {
            foobar: {
                getFoo: ({ foo }) => () => foo.getFoo(),
                getBar: ({ bar }) => () => bar.getBar(),
                getFoobar: ({ foobar }) => () => foobar.getFoo() + foobar.getBar()
            },
            foo: {
                getFoo: () => () => 'foo'
            },
            nested: {
                nested: {
                    getNested: () => () => 'nested'
                }
            },
            nestedTarget: {
                nestedFoo: {
                    getNestedFoo: () => () => 'nested-foo'
                }
            }
        };

        const { compose } = composer(target);
        const { foo } = compose('foo');
        compose('foobar', { foo, bar });
        compose('nestedTarget.nestedFoo');

        const expectedCode = `
(modules, { bar }) => {

    const foo = { ...modules.foo };
    const fooDependencies = { foo };
    foo.getFoo = foo.getFoo({ ...fooDependencies });

    const foobar = { ...modules.foobar };
    const foobarDependencies = { foobar, foo, bar };
    foobar.getFoo = foobar.getFoo({ ...foobarDependencies });
    foobar.getBar = foobar.getBar({ ...foobarDependencies });
    foobar.getFoobar = foobar.getFoobar({ ...foobarDependencies });

    const nestedFoo = { ...modules.nestedTarget.nestedFoo };
    const nestedFooDependencies = { nestedFoo };
    nestedFoo.getNestedFoo = nestedFoo.getNestedFoo({ ...nestedFooDependencies });

    return { ...modules, foo, foobar, nestedFoo };

};
`.trim();

        const code = compose.eject();
        // console.warn(code);
        const modules = eval(code)(target, { bar });
        t.equal(code, expectedCode);
        t.equal(modules.foobar.getFoobar(), 'foobar');
    });

};
