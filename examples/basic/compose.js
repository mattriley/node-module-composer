import composer from 'module-composer';
import modules from './modules';

export default () => {
    const { compose, composed } = composer(modules);
    const { stores } = compose('stores');
    const { services } = compose('services', { stores });
    const { components } = compose('components', { services });
    return composed();
};
