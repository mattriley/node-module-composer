const test = require('node:test');
const assert = require('node:assert/strict');
require('module-composer/extensions/global-register');

module.exports = composer => {

    test('register composition using name field in package.json', () => {
        const target = { foo: {}, window: {} };
        const extensions = { 'global-register': { globalThis } };
        const options = { extensions };
        const { compose } = composer(target, options);
        compose('foo', { bar: {} });
        const composition = compose.end();
        assert.deepEqual(globalThis.compositions.at(-1), { 'module-composer': composition });
    });

    test('composition is unnamed upon failure to read package.json', () => {
        const globalThis = { process: {} };
        const target = { foo: {}, window: {} };
        const extensions = { 'global-register': { globalThis } };
        const options = { extensions };
        const { compose } = composer(target, options);
        compose('foo', { bar: {} });
        const composition = compose.end();
        assert.deepEqual(globalThis.compositions.at(-1), { 'Unnamed Composition': composition });
    });

    test('register composition with custom name', () => {
        const target = { foo: {} };
        const configs = [{ compositionName: 'custom-name' }];
        const extensions = { 'global-register': { globalThis } };
        const { configure } = composer(target, { extensions });
        const { compose } = configure(configs);
        compose('foo', { bar: {} });
        const composition = compose.end();
        assert.deepEqual(globalThis.compositions.at(-1), { 'custom-name': composition });
    });

};
