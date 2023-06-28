module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/mermaid');

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
