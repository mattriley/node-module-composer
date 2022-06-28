const util = require('./util');

module.exports = (compose, stats) => (key, deps = {}) => {

    const startTime = performance.now();
    const result = compose(key, deps);
    const duration = performance.now() - startTime;
    util.set(stats.modules, [key, 'duration'], duration);
    stats.totalDuration += duration;
    return result;

};
