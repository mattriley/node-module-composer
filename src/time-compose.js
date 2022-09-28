const util = require('./util');

module.exports = (session, compose) => (path, deps, args, opts) => {

    const { stats } = session.state;
    const startTime = performance.now();
    const result = compose(path, deps, args, opts);
    const duration = performance.now() - startTime;
    util.set(stats.modules, [path, 'duration'], duration);
    stats.totalDuration += duration;
    return result;

};
