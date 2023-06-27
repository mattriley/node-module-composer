const test = require('node:test');
const assert = require('node:assert/strict');

module.exports = composer => {

    test('attempt to re-compose', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        compose('mod');
        assert.throws(() => compose('mod'), /^Error: mod is already composed$/);
    });

    test('ending a composition', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        compose('mod');
        const result = compose.end();
        assert.deepEqual(result.modules, compose.modules);
        assert.deepEqual(result.dependencies, compose.dependencies);
    });

    test('attempt to compose after ending', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        compose('mod');
        compose.end();
        assert.throws(() => compose('mod2'), /^Error: Composition has ended$/);
    });

    test('attempt to end after ending', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        compose.end();
        assert.throws(() => compose.end(), /^Error: Composition has already ended$/);
    });

};
