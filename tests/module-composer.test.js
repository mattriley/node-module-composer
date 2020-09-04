const { test } = require('zora');

const composer = require('../');

test('argument is optional', async t => {
    await new Promise(resolve => {
        const src = {
            foo: {
                fun: ({ foo }) => () => {
                    t.ok(typeof foo.fun === 'function');
                    resolve();
                }
            }
        };
    
        const foo = composer(src)('foo', undefined);
        foo.fun();
    });
});

test('peer function is invoked with arg', async () => {
    await new Promise(resolve => {
        const src = {
            foo: {
                fun1: ({ foo }) => () => {
                    foo.fun2();
                },
                fun2: () => () => {
                    resolve();
                }
            }
        };
    
        const foo = composer(src)('foo');
        foo.fun1();
    });
});

test('nested function is invoked', async () => {
    await new Promise(resolve => {
        const src = {
            foo: {
                bar: {
                    fun2: () => () => {
                        resolve();
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
