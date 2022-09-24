const composer = require('../');

module.exports = ({ test }) => {

    test('overrides are applied', t => {
        const target = { mod: {} };
        const overrides = { mod: { num: 1 } };
        const { compose } = composer(target, { overrides });
        compose('mod');
        t.equal(compose.modules, { mod: { num: 1 } });
        t.equal(compose.dependencies, { mod: [] });
    });

};
