const composer = require('../');

module.exports = ({ test }) => {

    test('target module unchanged if not composed', t => {
        const target = { foo: {}, bar: {} };
        const { compose } = composer(target);
        const { composition } = compose('foo');
        t.equal(composition.modules, { foo: {}, bar: {} });
        t.equal(composition.dependencies, { foo: [], bar: [] });
    });

    test('args are optional', t => {
        const target = { foo: {} };
        const { compose } = composer(target); // NOTE: No args.
        const { composition } = compose('foo');
        t.equal(composition.modules, { foo: {} });
        t.equal(composition.dependencies, { foo: [] });
    });

    test('args are applied', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        const { composition } = compose('foo', { bar: {} });
        t.equal(composition.modules, { foo: {} });
        t.equal(composition.dependencies, { foo: ['bar'] });
    });

    test('defaults are applied', t => {
        const target = { foo: {} };
        const defaults = { bar: {} };
        const config = { moduleComposer: { defaults } };
        const { compose } = composer(target, config);
        const { composition } = compose('foo');
        t.equal(composition.modules, { foo: {} });
        t.equal(composition.dependencies, { foo: ['bar'] });
    });

    test('overrides are applied', t => {
        const target = { foo: {} };
        const overrides = { foo: { num: 1 } };
        const config = { moduleComposer: { overrides } };
        const { compose } = composer(target, config);
        const { composition } = compose('foo');
        t.equal(composition.modules, { foo: { num: 1 } });
        t.equal(composition.dependencies, { foo: [] });
    });

    test('customiser is invoked', t => {
        const target = {
            foo: {
                customSetup: () => () => ({ bar: {} })
            }
        };
        const { compose } = composer(target);
        const { composition } = compose('foo', {}, foo => foo.customSetup());
        t.equal(composition.modules, { foo: { bar: {} } });
        t.equal(composition.dependencies, { foo: [] });
    });

    test('default customiser is invoked', t => {
        const target = {
            foo: {
                setup: () => () => ({ bar: {} })
            }
        };
        const { compose } = composer(target);
        const { composition } = compose('foo', {});
        t.equal(composition.modules, { foo: { bar: {} } });
        t.equal(composition.dependencies, { foo: [] });
    });

    test('non-objects are returned as-is', t => {
        const target = { foo: { bar: 1 } };
        const { compose } = composer(target);
        const { composition } = compose('foo');
        t.equal(composition.modules, { foo: { bar: 1 } });
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
        const { compose } = composer(target);
        const { composition } = compose('foo', { bar: {} });
        t.equal(composition.mermaid(), 'graph TD;\n    foo-->bar;');
    });

};
