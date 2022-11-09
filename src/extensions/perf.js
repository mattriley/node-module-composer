const util = require('module-composer/src/core/util');

const compose = session => {
    session.setState({ durationUnit: 'ms', totalDuration: 0, modules: {} });
    return compose => (path, deps, args, opts) => {
        const stats = session.getState();
        const startTime = performance.now();
        const result = compose(path, deps, args, opts);
        const duration = performance.now() - startTime;
        const modules = util.set({}, stats.modules, [path, 'duration'], duration);
        const totalDuration = stats.totalDuration + duration;
        session.setState({ totalDuration, modules });
        return result;
    };
};

module.exports = { compose };
