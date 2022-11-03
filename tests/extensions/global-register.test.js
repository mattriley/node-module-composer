const composer = require('module-composer');
require('module-composer/extensions/global-register');

module.exports = ({ test }) => {

    test('register composition with default name drawn from package.json', t => {
        const target = { foo: {}, window: {} };
        const { compose } = composer(target);
        compose('foo', { bar: {} });
        compose.globalRegister();
        const composition = compose.end();
        const [compositionName, matchedComposition] = globalThis.compositions.find(entry => entry[1] === composition);
        t.equal(composition, matchedComposition);
        t.equal(compositionName, 'module-composer');
    });

    test('register named composition', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose('foo', { bar: {} });
        compose.globalRegister({ name: 'foobar' });
        const composition = compose.end();
        const [compositionName, matchedComposition] = globalThis.compositions.find(entry => entry[1] === composition);
        t.equal(composition, matchedComposition);
        t.equal(compositionName, 'foobar');
    });

};
