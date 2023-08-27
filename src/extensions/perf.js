const precompose = session => ({ path, target }) => {
    const state = session.getState() ?? session.setState({ modules: {}, totalDuration: 0, durationUnit: 'ms' });
    const modules = { ...state.modules, [path]: { path, startTime: performance.now() } };
    session.setState({ modules });
    return target;
};

const postcompose = session => ({ path, target }) => {
    const state = session.getState();
    const module = state.modules[path];
    const endTime = performance.now();
    const duration = endTime - module.startTime;
    const modules = { ...state.modules, [path]: { ...module, endTime, duration } };
    const totalDuration = state.totalDuration + duration;
    session.setState({ totalDuration, modules });
    return target;
};

module.exports = { precompose, postcompose };
