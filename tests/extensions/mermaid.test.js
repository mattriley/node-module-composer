const composer = require('module-composer');
require('module-composer/extensions/mermaid');

module.exports = ({ test }) => {

    test('mermaid', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose('foo', { bar: {} });
        t.equal(compose.mermaid(), 'graph TD;\n    foo-->bar;');
    });

    test('mermaid omit', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose('foo', { bar: {} });
        t.equal(compose.mermaid({ omit: ['foo'] }), 'graph TD;');
    });

};
