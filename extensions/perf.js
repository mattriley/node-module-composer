const util = require('module-composer/src/util');
const extensions = require('module-composer/src/extensions');

const perf = (compose, session) => (path, deps, args, opts) => {
    const { stats = {} } = session.state;
    const startTime = performance.now();
    const result = compose(path, deps, args, opts);
    const duration = performance.now() - startTime;
    util.set(stats.modules, [path, 'duration'], duration);
    stats.totalDuration += duration;
    return result;
};

const compose = perf;
module.exports = extensions.register({ compose });
