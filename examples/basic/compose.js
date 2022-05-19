const composer = require('module-composer');
const modules = require('./modules');

module.exports = () => {
    const { compose } = composer(modules);
    const { stores } = compose('stores');
    const { services } = compose('services', { stores });
    const { components } = compose('components', { services });
    return { stores, services, components };
};
