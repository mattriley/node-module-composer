const composer = require('module-composer');

module.exports = ({ test }) => {

    test('target is not a plain object', t => {
        const target = [];
        t.throws(() => composer(target), /^target must be a plain object$/);
    });

    test('key not provided', t => {
        const target = {};
        const { compose } = composer(target);
        t.throws(() => compose(), /^key is required$/);
    });

    test('key not found', t => {
        const target = {};
        const { compose } = composer(target);
        t.throws(() => compose('mod'), /^mod not found$/);
        t.throws(() => compose('mod1.modA'), /^mod1.modA not found$/);
    });

    test('target with non-plain object module', t => {
        const target = { mod: 1 };
        const { compose } = composer(target);
        t.throws(() => compose('mod'), /^mod must be a plain object$/);
    });

};
