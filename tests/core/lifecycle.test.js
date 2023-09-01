module.exports = ({ test, assert }) => composer => {

    test('attempt to re-compose', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        compose('mod', {});
        assert.throws(() => compose('mod', {}), /^Error: mod is already composed$/);
    });

    test('ending a composition', () => {
        const target = { mod: {} };
        const { compose } = composer(target);
        compose('mod', {});
        const result = compose.done();
        assert.deepEqual(result.modules, compose.modules);
        assert.deepEqual(result.dependencies, compose.dependencies);
    });

};
