const util = require('./util');

module.exports = (props, compose) => (key, deps) => {

    const { stats } = props;
    const startTime = performance.now();
    const result = compose(key, deps);
    const duration = performance.now() - startTime;
    util.set(stats.modules, [key, 'duration'], duration);
    stats.totalDuration += duration;
    return result;

};
