import composer from 'module-composer';
import modules from './modules';

export default () => {
    const { compose } = composer(modules);
    const { stores } = compose('stores');
    const { services } = compose('services', { stores });
    return compose('components', { services });
};
