module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/global-register');

    test('register composition using name field in package.json', () => {
        const target = { foo: {}, window: {} };
        const { compose } = composer(target, { globalThis });
        compose('foo', { bar: {} });
        const composition = compose.end();
        assert.deepEqual(globalThis.compositions.at(-1), { 'module-composer': composition });
    });

    test('composition is unnamed upon failure to read package.json', () => {
        const globalThis = { process: {} };
        const target = { foo: {}, window: {} };
        const { compose } = composer(target, { globalThis });
        compose('foo', { bar: {} });
        const composition = compose.end();
        assert.deepEqual(globalThis.compositions.at(-1), { 'Unnamed Composition': composition });
    });

    test('register composition with custom name', () => {
        const target = { foo: {} };
        const configs = [{ compositionName: 'custom-name' }];
        const { configure } = composer(target, { globalThis });
        const { compose } = configure(configs);
        compose('foo', { bar: {} });
        const composition = compose.end();
        assert.deepEqual(globalThis.compositions.at(-1), { 'custom-name': composition });
    });

};
