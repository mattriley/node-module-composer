const { test } = require('zora');

const composer = require('../');

test('dependencies are optional', t => {
    const modules = { foo: {} };
    const compose = composer(modules);
    compose('foo');
    t.equal(compose.getModules(), { foo: {} });
    t.equal(compose.getDependencies(), { foo: [] });
});

test('dependencies are applied', t => {
    const modules = { foo: {} };
    const compose = composer(modules);
    compose('foo', { bar: {} });
    t.equal(compose.getModules(), { foo: {} });
    t.equal(compose.getDependencies(), { foo: ['bar'] });
});

test('defaults are applied', t => {
    const modules = { foo: {} };
    const compose = composer(modules, { bar: {} });
    compose('foo');
    t.equal(compose.getModules(), { foo: {} });
    t.equal(compose.getDependencies(), { foo: ['bar'] });
});

test('initialiser is invoked', t => {
    const modules = {
        foo: {
            setup: () => () => ({ bar: {} })
        }
    };
    const compose = composer(modules);
    compose('foo', undefined, foo => foo.setup());
    t.equal(compose.getModules(), { foo: { bar: {} } });
    t.equal(compose.getDependencies(), { foo: [] });
});

test('avoids following non-objects', t => {
    const modules = { foo: { bar: 1 } };
    const compose = composer(modules);
    compose('foo');
    t.equal(compose.getModules(), { foo: { bar: 1 } });
    t.equal(compose.getDependencies(), { foo: [] });
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

    const compose = composer(modules);
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

    const compose = composer(modules);
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

    const compose = composer(modules);
    compose('foo').fun1();
    t.ok(fun2Called);
});
