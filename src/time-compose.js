const util = require('./util');

module.exports = (session, compose) => (key, deps, args, opts) => {

    const { stats } = session.state;
    const startTime = performance.now();
    const result = compose(key, deps, args, opts);
    const duration = performance.now() - startTime;
    util.set(stats.modules, [key, 'duration'], duration);
    stats.totalDuration += duration;
    return result;

};
