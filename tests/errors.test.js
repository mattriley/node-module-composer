const composer = require('../');

module.exports = ({ test }) => {

    test('key not provided', t => {
        const target = {};
        const { compose } = composer(target);
        t.throws(() => compose(), /^key is required$/);
    });

    test('key not found', t => {
        const target = {};
        const { compose } = composer(target);
        t.throws(() => compose('mod'), 'mod not found');
        t.throws(() => compose('mod1.modA'), /^mod1.modA not found$/);
    });

    test('target with non-plain object module', t => {
        const target = { mod: 1 };
        const { compose } = composer(target);
        t.throws(() => compose('mod'), /^mod is not a plain object$/);
    });

    test('already composed', t => {
        const target = { mod: {} };
        const { compose } = composer(target);
        compose('mod');
        t.throws(() => compose('mod'), /^mod is already composed$/);
    });

    test('composition ended', t => {
        const target = { mod: {} };
        const { compose } = composer(target);
        compose('mod');
        const composition = compose.end();
        t.equal(composition.modules, { mod: {} });
        t.throws(() => compose('mod2'), /^Composition has ended$/);
    });

    test('composition already ended', t => {
        const target = { mod: {} };
        const { compose } = composer(target);
        compose.end();
        t.throws(() => compose.end(), /^Composition has already ended$/);
    });

};
