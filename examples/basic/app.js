import compose from './compose';
const { modules } = compose();
const app = modules.components.app();
document.getElementById('app').append(app);
