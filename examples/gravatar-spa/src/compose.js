import composer from 'module-composer';
import modules from './modules';
import defaultConfig from './default-config';

export default ({ overrides } = {}) => {
    const { compose, config } = composer(modules, { overrides, defaultConfig });
    const io = { fetch: (...args) => window.fetch(...args) };
    const { services } = compose('services', { io, config });
    compose('components', { services });
    return compose.end();
};
