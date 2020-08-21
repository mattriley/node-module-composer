const test = require('tape');
const composer = require('./');

test('argument is optional', t => {
    const src = {
        foo: {
            fun: ({ foo }) => () => {
                t.true(typeof foo.fun === 'function');
                t.end();
            }
        }
    };

    const foo = composer(src)('foo', undefined);
    foo.fun();
});

test('peer function is invoked with arg', t => {
    const src = {
        foo: {
            fun1: ({ foo }) => () => {
                foo.fun2();
            },
            fun2: () => () => {
                t.pass();
                t.end();
            }
        }
    };

    const foo = composer(src)('foo');
    foo.fun1();
});

test('nested function is invoked', t => {
    const src = {
        foo: {
            bar: {
                fun2: () => () => {
                    t.pass();
                    t.end();
                }
            },
            fun1: ({ foo }) => () => {
                foo.bar.fun2();
            }
        }
    };

    const foo = composer(src)('foo');
    foo.fun1();
});

test('function name matching parent key is collapsed', t => {
    const src = {
        foo: {
            foo: ({ foo }) => () => {
                foo.bar();
            },
            bar: () => () => {
                t.pass();
                t.end();
            }
        }
    };

    const foo = composer(src)('foo');
    foo();
});
