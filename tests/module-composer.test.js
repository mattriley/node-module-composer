const { test } = require('zora');

const composer = require('../');

test('dependencies are optional', t => {
    const modules = { foo: {} };
    const compose = composer(modules);
    compose('foo');
    const actual = compose.done();
    const expected = { modules: { foo: {} }, dependencies: { foo: [] } };
    t.equal(actual, expected);
});

test('dependencies are applied', t => {
    const modules = { foo: {} };
    const compose = composer(modules);
    compose('foo', { bar: {} });
    const actual = compose.done();
    const expected = { modules: { foo: {} }, dependencies: { foo: ['bar'] } }
    t.equal(actual, expected);
});

test('initialiser is invoked', t => {
    const modules = {
        foo: {
            setup: () => () => ({ bar: {} })
        }
    };
    const compose = composer(modules);
    compose('foo', undefined, foo => foo.setup());
    const actual = compose.done();
    const expected = { modules: { foo: { bar: {} } }, dependencies: { foo: [] } };
    t.equal(actual, expected);
});

test('avoids following non-objects', t => {
    const modules = { foo: { bar: 1 } };
    const compose = composer(modules);
    compose('foo');
    const actual = compose.done();
    const expected = { modules: { foo: { bar: 1 } }, dependencies: { foo: [] } };
    t.equal(actual, expected);
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
