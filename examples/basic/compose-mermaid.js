import composer from 'module-composer';
import modules from './modules';

const { compose, mermaid } = composer(modules);
const { stores } = compose('stores');
const { services } = compose('services', { stores });
const { components } = compose('components', { services });

const diagram = mermaid();
