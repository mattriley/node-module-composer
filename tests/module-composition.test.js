/* eslint-disable no-underscore-dangle */
const test = require('tape');
const compose = require('..');

test('object without __modulename is unchanged', t => {
    const obj = {
        foo: 'FOO',
        fun: () => undefined
    };

    Object.freeze(obj);
    const foo = compose(obj);
    t.strictEqual(foo, obj);
    t.end();
});

test('__modulename is removed', t => {
    const obj = {
        __modulename: 'foo'
    };

    const foo = compose(obj);
    t.equal(foo.__modulename, undefined);
    t.end();
});

test('argument is optional', t => {
    const obj = {
        __modulename: 'foo',
        fun: ({ foo }) => () => {
            t.true(typeof foo.fun === 'function');
            t.end();
        }
    };

    const foo = compose(obj, undefined);
    foo.fun();
});

test('argument without __modulename is unchanged', t => {
    const obj = {
        __modulename: 'foo',
        fun: ({ foo, bar }) => () => {
            t.true(typeof foo.fun === 'function');
            t.equal(bar, 'BAR');
            t.end();
        }
    };

    const foo = compose(obj, { bar: 'BAR' });
    foo.fun();
});

test('peer function is invoked with arg', t => {
    const obj = {
        __modulename: 'foo',
        fun1: ({ foo }) => num => {
            t.equal(num, 1);
            foo.fun2(2);
        },
        fun2: () => num => {
            t.equal(num, 2);
            t.end();
        }
    };

    const foo = compose(obj);
    foo.fun1(1);
});

test('nested function is invoked', t => {
    const obj = {
        __modulename: 'foo',
        bar: {
            __modulename: 'bar',
            fun2: ({ foo, bar }) => () => {
                t.ok(foo);
                t.ok(bar);
                t.end();
            }
        },
        fun1: ({ foo }) => () => {
            foo.bar.fun2();
        }
    };

    const foo = compose(obj);
    foo.fun1();
});
