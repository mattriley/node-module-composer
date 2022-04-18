const { test } = require('zora');

const composer = require('../');

test('dependencies are optional', t => {
    const inputModules = { foo: {} };
    const compose = composer(inputModules);
    const { composition, ...modules } = compose('foo');
    t.equal(modules, { foo: {} });
    t.equal(composition.dependencies, { foo: [] });
});

test('dependencies are applied', t => {
    const inputModules = { foo: {} };
    const compose = composer(inputModules);
    const { composition, ...modules } = compose('foo', { bar: {} });
    t.equal(modules, { foo: {} });
    t.equal(composition.dependencies, { foo: ['bar'] });
});

test('defaults are applied', t => {
    const inputModules = { foo: {} };
    const defaults = { bar: {} };
    const compose = composer(inputModules, { defaults });
    const { composition, ...modules } = compose('foo');
    t.equal(modules, { foo: {} });
    t.equal(composition.dependencies, { foo: ['bar'] });
});

test('initialiser is invoked', t => {
    const inputModules = {
        foo: {
            setup: () => () => ({ bar: {} })
        }
    };
    const compose = composer(inputModules);
    const { composition, ...modules } = compose('foo', undefined, foo => foo.setup());
    t.equal(modules, { foo: { bar: {} } });
    t.equal(composition.dependencies, { foo: [] });
});

test('avoids following non-objects', t => {
    const inputModules = { foo: { bar: 1 } };
    const compose = composer(inputModules);
    const { composition, ...modules } = compose('foo');
    t.equal(modules, { foo: { bar: 1 } });
    t.equal(composition.dependencies, { foo: [] });
});

test('peer function is invoked with arg', t => {
    let fun2Called = false;

    const inputModules = {
        foo: {
            fun1: ({ foo }) => () => {
                foo.fun2();
            },
            fun2: () => () => {
                fun2Called = true;
            }
        }
    };

    const compose = composer(inputModules);
    const { foo } = compose('foo')
    foo.fun1();
    t.ok(fun2Called);
});

test('peer function is invoked with arg', t => {
    let fun2Called = false;

    const inputModules = {
        foo: {
            fun1: ({ foo }) => () => {
                foo.fun2();
            },
            fun2: () => () => {
                fun2Called = true;
            }
        }
    };

    const compose = composer(inputModules);
    const { foo } = compose('foo')
    foo.fun1();
    t.ok(fun2Called);
});

test('nested function is invoked', t => {
    let fun2Called = false;

    const modules = {
        foo: {
            bar: {
                fun2: () => () => {
                    fun2Called = true
                }
            },
            fun1: ({ foo }) => () => {
                foo.bar.fun2();
            }
        }
    };

    const compose = composer(modules);
    const { foo } = compose('foo')
    foo.fun1();
    t.ok(fun2Called);
});
