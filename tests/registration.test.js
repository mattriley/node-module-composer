const composer = require('module-composer');

module.exports = ({ test }) => {

    test('register composition with default name drawn from package.json', t => {
        const target = { foo: {}, window: {} };
        const { compose } = composer(target);
        compose('foo', { bar: {} });
        const composition = compose.end();
        const matchedComposition = globalThis.compositions.find(c => c === composition);
        t.equal(composition, matchedComposition);
        t.equal(matchedComposition.compositionName, 'module-composer');
    });

    test('register named composition', t => {
        const target = { foo: {} };
        const { compose } = composer(target, { compositionName: 'foobar' });
        compose('foo', { bar: {} });
        const composition = compose.end();
        const matchedComposition = globalThis.compositions.find(c => c === composition);
        t.equal(composition, matchedComposition);
        t.equal(matchedComposition.compositionName, 'foobar');
    });

};
