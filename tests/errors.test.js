const composer = require('../');

module.exports = ({ test }) => {

    test('key not provided', t => {
        const target = {};
        const { compose } = composer(target);
        t.throws(() => compose(), 'key is required');
    });

    test('key not found', t => {
        const target = {};
        const { compose } = composer(target);
        t.throws(() => compose('foo'), 'foo not found');
        t.throws(() => compose('foo.bar'), 'foo.bar not found');
    });

    test('already composed', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose('foo');
        t.throws(() => compose('foo'), 'foo already composed');
    });

    test('composition ended', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose('foo');
        const composition = compose.end();
        t.equal(composition.modules, { foo: {} });
        t.throws(() => compose('bar'), 'Composition has ended');
    });

    test('composition already ended', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose.end();
        t.throws(() => compose.end(), 'Composition has already ended');
    });

};
