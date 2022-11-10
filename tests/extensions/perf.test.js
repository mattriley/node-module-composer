const composer = require('module-composer');
require('module-composer/extensions/perf');

module.exports = ({ test }) => {

    test('perf', t => {
        const target = { foo: {} };
        const { compose } = composer(target);
        compose('foo', { bar: {} });
        const { perf } = compose.extensions;
        t.equal(perf.durationUnit, 'ms');
        t.ok(perf.totalDuration > 0);
        t.ok(perf.modules.foo.duration > 0);
    });

};
