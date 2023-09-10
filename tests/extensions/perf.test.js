module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/perf');

    test('perf', () => {
        const target = { foo: {}, bar: {} };
        const { compose } = composer(target);
        compose('foo', { bar: {} });
        compose('bar', { bar: {} });
        const perf = compose.perf();
        assert.deepEqual(perf.durationUnit, 'ms');
        assert(perf.totalDuration > 0);
        assert(perf.modules.foo.duration > 0);
    });

};
