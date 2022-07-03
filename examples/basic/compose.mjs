import composer from 'module-composer';
import modules from './modules/index.mjs';

export default () => {
    const { compose } = composer(modules);
    const { stores } = compose('stores');
    const { services } = compose('services', { stores });
    compose('components', { services });
    return compose.end();
};
