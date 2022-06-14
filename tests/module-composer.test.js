const composer = require('../');

module.exports = ({ test }) => {

    test('can get composition', t => {
        const target = { foo: {} };
        const { compose, composition } = composer(target);
        t.ok(composition);
        t.equal(compose.composition, composition);
    });

    test('can get target', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        t.equal(compose.target, target);
        t.equal(compose.getTarget(), target);
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
        t.equal(compose.getConfig(), { a: { b: 'B', c: 'C', d: 'D' } });
    });

    test('target module unchanged if not composed', t => {
        const target = { foo: {}, bar: {} };
        const { compose } = composer(target);
        compose('foo');
        t.equal(compose.modules, { foo: {}, bar: {} });
        t.equal(compose.dependencies, { foo: [], bar: [] });
    });

    test('key not found', t => {
        const target = {};
        const { compose } = composer(target);
        t.throws(() => compose('foo'), 'foo not found');
        t.throws(() => compose('foo.bar'), 'foo.bar not found');
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
        t.equal(compose.getModules(), { foo: {} });
        t.equal(compose.dependencies, { foo: ['bar'] });
        t.equal(compose.getDependencies(), { foo: ['bar'] });
    });

    test('args are applied to nested object', t => {
        const target = { foo: { bar: {} } };
        const { compose } = composer(target);
        compose('foo.bar', { baz: {} });
        t.equal(compose.modules, { foo: { bar: {} } });
        t.equal(compose.getModules(), { foo: { bar: {} } });
        t.equal(compose.dependencies, { foo: [], 'foo.bar': ['baz'] });
        t.equal(compose.getDependencies(), { foo: [], 'foo.bar': ['baz'] });
    });

    test('defaults are applied', t => {
        const target = { foo: {} };
        const defaults = { bar: {} };
        const { compose } = composer(target, { defaults });
        compose('foo');
        t.equal(compose.modules, { foo: {} });
        t.equal(compose.dependencies, { foo: ['bar'] });
    });

    test('overrides are applied', t => {
        const target = { foo: {} };
        const overrides = { foo: { num: 1 } };
        const { compose } = composer(target, { overrides });
        compose('foo');
        t.equal(compose.modules, { foo: { num: 1 } });
        t.equal(compose.dependencies, { foo: [] });
    });

    test('customiser is invoked', t => {
        const target = {
            foo: {
                customSetup: () => () => ({ bar: {} })
            }
        };
        const { compose } = composer(target);
        compose('foo', {}, foo => foo.customSetup());
        t.equal(compose.modules, { foo: { bar: {} } });
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

    test('non-objects are returned as-is', t => {
        class Classy { }
        const target = {
            foo: {
                num: 1,
                str: 'str',
                bool: true,
                regex: /abc/,
                Classy,
                inst: new Classy(),
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

        const { compose } = composer(modules);
        const { foo } = compose('foo');
        foo.fun1();
        t.ok(fun2Called);
    });

    test('mermaid', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose('foo', { bar: {} });
        t.equal(compose.mermaid, 'graph TD;\n    foo-->bar;');
    });

    test('mermaid omit', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose('foo', { bar: {} });
        t.equal(compose.generateMermaid({ omit: ['foo'] }), 'graph TD;');
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
                getFoo: () => () => 'foo',
            }
        };

        const { compose } = composer(target);
        const { foo } = compose('foo');
        compose('foobar', { foo, bar });

        const expectedCode = `
(modules, { bar }) => {
    const foo = { ...modules.foo };
    foo.getFoo = modules.foo.getFoo({ foo });
    const foobar = { ...modules.foobar };
    foobar.getFoo = modules.foobar.getFoo({ foobar, foo, bar });
    foobar.getBar = modules.foobar.getBar({ foobar, foo, bar });
    foobar.getFoobar = modules.foobar.getFoobar({ foobar, foo, bar });
    return { ...modules, foobar, foo };
};
`.trim();

        const code = compose.eject();
        // console.warn(code);
        const modules = eval(code)(target, { bar });
        t.equal(code, expectedCode);
        t.equal(modules.foobar.getFoobar(), 'foobar');
    });

};
