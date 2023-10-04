module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/perf');

    test('perf', () => {
        const target = { mod1: {}, mod2: {} };
        const { compose } = composer(target);
        compose('mod1');
        compose('mod2');
        const perf = compose.perf();
        assert.deepEqual(perf.durationUnit, 'ms');
        assert(perf.totalDuration > 0);
        assert(perf.modules.mod1.duration > 0);
    });

};
