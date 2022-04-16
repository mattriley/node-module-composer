const { test } = require('zora');

const composer = require('../');

test('dependencies are optional', t => {
    const modules = { foo: {} };
    const compose = composer(modules, { compositionModule: { enabled: false } });
    compose('foo');
    t.equal(compose.modules, { foo: {} });
    t.equal(compose.dependencies, { foo: [] });
});

test('dependencies are applied', t => {
    const modules = { foo: {} };
    const compose = composer(modules, { compositionModule: { enabled: false } });
    compose('foo', { bar: {} });
    t.equal(compose.modules, { foo: {} });
    t.equal(compose.dependencies, { foo: ['bar'] });
});

test('defaults are applied', t => {
    const modules = { foo: {} };
    const defaults = { bar: {} };
    const compose = composer(modules, { defaults, compositionModule: { enabled: false } });
    compose('foo');
    t.equal(compose.modules, { foo: {} });
    t.equal(compose.dependencies, { foo: ['bar'] });
});

test('initialiser is invoked', t => {
    const modules = {
        foo: {
            setup: () => () => ({ bar: {} })
        }
    };
    const compose = composer(modules, { compositionModule: { enabled: false } });
    compose('foo', undefined, foo => foo.setup());
    t.equal(compose.modules, { foo: { bar: {} } });
    t.equal(compose.dependencies, { foo: [] });
});

test('avoids following non-objects', t => {
    const modules = { foo: { bar: 1 } };
    const compose = composer(modules, { compositionModule: { enabled: false } });
    compose('foo');
    t.equal(compose.modules, { foo: { bar: 1 } });
    t.equal(compose.dependencies, { foo: [] });
});

test('peer function is invoked with arg', t => {
    let fun2Called = false;

    const modules = {
        foo: {
            fun1: ({ foo }) => () => {
                foo.fun2();
            },
            fun2: () => () => {
                fun2Called = true;
            }
        }
    };

    const compose = composer(modules, { compositionModule: { enabled: false } });
    compose('foo').fun1();
    t.ok(fun2Called);
});

test('peer function is invoked with arg', t => {
    let fun2Called = false;

    const modules = {
        foo: {
            fun1: ({ foo }) => () => {
                foo.fun2();
            },
            fun2: () => () => {
                fun2Called = true;
            }
        }
    };

    const compose = composer(modules, { compositionModule: { enabled: false } });
    compose('foo').fun1();
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

    const compose = composer(modules, { compositionModule: { enabled: false } });
    compose('foo').fun1();
    t.ok(fun2Called);
});
