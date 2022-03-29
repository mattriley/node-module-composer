// const { test } = require('zora');

// const composer = require('../');

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
