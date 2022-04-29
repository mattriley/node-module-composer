const composer = require('module-composer');
const modules = require('./modules');

module.exports = ({ config }) => {

    const compose = composer(modules);
    const { util } = compose('util');
    return compose('services', { config, util });

};
