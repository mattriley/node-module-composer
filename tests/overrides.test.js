const composer = require('../');

module.exports = ({ test }) => {

    test('overrides are applied', t => {
        const target = { foo: {} };
        const overrides = { foo: { num: 1 } };
        const { compose } = composer(target, { overrides });
        compose('foo');
        t.equal(compose.modules, { foo: { num: 1 } });
        t.equal(compose.dependencies, { foo: [] });
    });

};
