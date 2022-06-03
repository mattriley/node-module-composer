import composer from 'module-composer';
import modules from './modules';

export default () => {

    const { compose } = composer(modules);
    const { services } = compose('services');
    compose('components', { services });

    return compose;

};
