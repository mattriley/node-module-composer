const { test } = require('zora');

const composer = require('../');

test('argument is optional', t => {
    let fooIsFunction = false;

    const src = {
        foo: {
            fun: ({ foo }) => () => {
                fooIsFunction = typeof foo.fun === 'function';
            }
        }
    };

    const foo = composer(src)('foo', undefined);
    foo.fun();
    t.ok(fooIsFunction);
});

test('peer function is invoked with arg', t => {
    let fun2Called = false;

    const src = {
        foo: {
            fun1: ({ foo }) => () => {
                foo.fun2();
            },
            fun2: () => () => {
                fun2Called = true;
            }
        }
    };

    const foo = composer(src)('foo');
    foo.fun1();
    t.ok(fun2Called);
});

test('nested function is invoked', t => {
    let fun2Called = false;

    const src = {
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

    const foo = composer(src)('foo');
    foo.fun1();
    t.ok(fun2Called);
});

test('function name matching parent key is collapsed', async () => {
    await new Promise(resolve => {
        const src = {
            foo: {
                foo: ({ foo }) => () => {
                    foo.bar();
                },
                bar: () => () => {
                    resolve();
                }
            }
        };

        const foo = composer(src)('foo');
        foo();
    });
});
