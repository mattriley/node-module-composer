import composer from 'module-composer';
import modules from './modules';

export default () => {
    const { compose, composition } = composer(modules);
    const { stores } = compose('stores');
    const { services } = compose('services', { stores });
    const { components } = compose('components', { services });
    return composition;
};
