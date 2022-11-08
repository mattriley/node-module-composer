const util = require('module-composer/src/util');
const extensions = require('module-composer/src/extensions');

const compose = session => compose => (path, deps, args, opts) => {
    const stats = session.getState();
    const startTime = performance.now();
    const result = compose(path, deps, args, opts);
    const duration = performance.now() - startTime;
    const modules = util.set({}, stats.modules, [path, 'duration'], duration);
    const totalDuration = stats.totalDuration + duration;
    session.setState({ totalDuration, modules });
    return result;
};

const extension = {
    name: 'perf',
    session: session => {
        session.setState({ durationUnit: 'ms', totalDuration: 0, modules: {} });
        return {
            compose: compose(session)
        };
    }
};

module.exports = extensions.register(extension);
