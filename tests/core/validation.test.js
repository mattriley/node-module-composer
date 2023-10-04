module.exports = ({ test, assert }) => composer => {

    test('target is not a plain object', () => {
        const target = [];
        assert.throws(() => composer(target), /^Error: target must be a plain object$/);
    });

    test('key not provided', () => {
        const target = {};
        const { compose } = composer(target);
        assert.throws(() => compose(), /^Error: Missing path$/);
    });

    test('key not found', () => {
        const target = {};
        const { compose } = composer(target);
        assert.throws(() => compose('mod', {}), /^Error: mod not found$/);
        assert.throws(() => compose('mod1.modA', {}), /^Error: mod1.modA not found$/);
    });

    test('target with non-plain object module', () => {
        const target = { mod: 1 };
        const { compose } = composer(target);
        assert.throws(() => compose('mod', {}), /^Error: mod must be a plain object$/);
    });

    test('naming collision', () => {
        const target = { mod: {} };
        const mod = {};
        const { compose } = composer(target);
        assert.throws(() => compose('mod', { mod }), /^Error: mod already exists$/);
    });

};
