const precompose = session => ({ path }) => {
    const state = session.getState() ?? session.setState({ modules: {}, totalDuration: 0, durationUnit: 'ms' });
    const modules = { ...state.modules, [path]: { path, startTime: performance.now() } };
    session.setState({ modules });
};

const postcompose = session => ({ path }) => {
    const state = session.getState();
    const module = state.modules[path];
    const endTime = performance.now();
    const duration = endTime - module.startTime;
    const modules = { ...state.modules, [path]: { ...module, endTime, duration } };
    const totalDuration = state.totalDuration + duration;
    session.setState({ totalDuration, modules });
};

const perf = session => () => session.extensions.perf;

module.exports = { precompose, postcompose, perf };
