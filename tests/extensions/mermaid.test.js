const test = require('node:test');
const assert = require('node:assert/strict');
require('module-composer/extensions/mermaid');

module.exports = composer => {

    test('mermaid', () => {
        const target = { foo: {} };
        const { compose } = composer(target, { extensions: ['mermaid'] });
        compose('foo', { bar: {} });
        assert.deepEqual(compose.mermaid(), 'graph TD;\n    foo-->bar;');
    });

    test('mermaid omit', () => {
        const target = { foo: {} };
        const { compose } = composer(target, { extensions: ['mermaid'] });
        compose('foo', { bar: {} });
        assert.deepEqual(compose.mermaid({ omit: ['foo'] }), 'graph TD;');
    });

};
