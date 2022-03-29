const { test } = require('zora');

const composer = require('../');

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
    const foo = compose('foo');
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
    const foo = compose('foo');
    foo.fun1();
    t.ok(fun2Called);
});

// test('get dependencies', t => {
//     const src = { foo: {}, bar: {} };
//     const compose = composer(src);
//     const foo = compose('foo');
//     compose('bar', { foo });
//     const expected = { foo: [], bar: ['foo'] };
//     t.equal(compose.getDependencies(), expected);
// });

// test('get modules', t => {
//     const src = { foo: {}, bar: {} };
//     const compose = composer(src);
//     const foo = compose('foo');
//     compose('bar', { foo });
//     const expected = { foo: {}, bar: {} };
//     t.equal(compose.getModules(), expected);
// });

// test('get module', t => {
//     const src = { foo: {}, bar: {} };
//     const compose = composer(src);
//     const foo = compose('foo');
//     compose('bar', { foo });
//     const expected = {};
//     t.equal(compose.getModule('foo'), expected);
// });

// test('add modules', t => {
//     const src = {};
//     const compose = composer(src);
//     compose.addModules({ foo: {} });
//     t.equal(compose.getDependencies(), { foo: [] });
// });
