module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/perf');

    test('perf', () => {
        const target = { foo: {} };
        const { compose } = composer(target, { extensions: ['perf'] });
        compose('foo', { bar: {} });
        const { perf } = compose.extensions;
        assert.deepEqual(perf.durationUnit, 'ms');
        assert(perf.totalDuration > 0);
        assert(perf.modules.foo.duration > 0);
    });

};
