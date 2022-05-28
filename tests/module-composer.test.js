const composer = require('../');

module.exports = ({ test }) => {

    test('can get target', t => {
        const target = { foo: {} };
        const { composition } = composer(target);
        t.equal(composition.target, target);
        t.equal(composition.getTarget(), target);
    });

    test('merges config', t => {
        const config1 = { a: { b: 'B', c: 'c' } };
        const config2 = { a: { c: 'C', d: 'D' } };
        const { composition } = composer({}, config1, config2);
        t.equal(composition.config, { a: { b: 'B', c: 'C', d: 'D' } });
        t.equal(composition.getConfig(), { a: { b: 'B', c: 'C', d: 'D' } });
    });

    test('target module unchanged if not composed', t => {
        const target = { foo: {}, bar: {} };
        const { compose, composition } = composer(target);
        compose('foo');
        t.equal(composition.modules, { foo: {}, bar: {} });
        t.equal(composition.dependencies, { foo: [], bar: [] });
    });

    test('args are optional', t => {
        const target = { foo: {} };
        const { compose, composition } = composer(target);
        compose('foo');
        t.equal(composition.modules, { foo: {} });
        t.equal(composition.dependencies, { foo: [] });
    });

    test('args are applied', t => {
        const target = { foo: {} };
        const { compose, composition } = composer(target);
        compose('foo', { bar: {} });
        t.equal(composition.modules, { foo: {} });
        t.equal(composition.getModules(), { foo: {} });
        t.equal(composition.dependencies, { foo: ['bar'] });
        t.equal(composition.getDependencies(), { foo: ['bar'] });
    });

    test('defaults are applied', t => {
        const target = { foo: {} };
        const defaults = { bar: {} };
        const config = { moduleComposer: { defaults } };
        const { compose, composition } = composer(target, config);
        compose('foo');
        t.equal(composition.modules, { foo: {} });
        t.equal(composition.dependencies, { foo: ['bar'] });
    });

    test('overrides are applied', t => {
        const target = { foo: {} };
        const overrides = { foo: { num: 1 } };
        const config = { moduleComposer: { overrides } };
        const { compose, composition } = composer(target, config);
        compose('foo');
        t.equal(composition.modules, { foo: { num: 1 } });
        t.equal(composition.dependencies, { foo: [] });
    });

    test('customiser is invoked', t => {
        const target = {
            foo: {
                customSetup: () => () => ({ bar: {} })
            }
        };
        const { compose, composition } = composer(target);
        compose('foo', {}, foo => foo.customSetup());
        t.equal(composition.modules, { foo: { bar: {} } });
        t.equal(composition.dependencies, { foo: [] });
    });

    test('default customiser is invoked', t => {
        const target = {
            foo: {
                setup: () => () => ({ bar: {} })
            }
        };
        const { compose, composition } = composer(target);
        compose('foo', {});
        t.equal(composition.modules, { foo: { bar: {} } });
        t.equal(composition.dependencies, { foo: [] });
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
        const { compose, composition } = composer(target);
        compose('foo');
        t.equal(composition.modules, target);
        t.equal(composition.dependencies, { foo: [] });
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
        const { compose, composition } = composer(target);
        compose('foo', { bar: {} });
        t.equal(composition.mermaid(), 'graph TD;\n    foo-->bar;');
    });

    test('mermaid omit', t => {
        const target = { foo: {} };
        const { compose, composition } = composer(target);
        compose('foo', { bar: {} });
        t.equal(composition.mermaid({ omit: ['foo'] }), 'graph TD;');
    });

};
