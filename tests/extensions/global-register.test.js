const composer = require('module-composer');
require('module-composer/extensions/global-register');

module.exports = ({ test }) => {

    test('register composition using name field in package.json', t => {
        const target = { foo: {}, window: {} };
        const options = { extensions: ['global-register'], extensionsConfig: { 'global-register': { globalThis } } };
        const { compose } = composer(target, options);
        compose('foo', { bar: {} });
        const composition = compose.end();
        t.deepEqual(globalThis.compositions.at(-1), { 'module-composer': composition });
    });

    test('composition is unnamed upon failure to read package.json', t => {
        const globalThis = { process: {} };
        const target = { foo: {}, window: {} };
        const options = { extensions: ['global-register'], extensionsConfig: { 'global-register': { globalThis } } };
        const { compose } = composer(target, options);
        compose('foo', { bar: {} });
        const composition = compose.end();
        t.deepEqual(globalThis.compositions.at(-1), { 'Unnamed Composition': composition });
    });

    test('register composition with custom name', t => {
        const target = { foo: {} };
        const configs = [{ compositionName: 'custom-name' }];
        const options = { configs, extensions: ['global-register'], extensionsConfig: { 'global-register': { globalThis } } };
        const { compose } = composer(target, options);
        compose('foo', { bar: {} });
        const composition = compose.end();
        t.equal(globalThis.compositions.at(-1), { 'custom-name': composition });
    });

};
