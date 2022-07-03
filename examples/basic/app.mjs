import compose from './compose.mjs';
const { modules } = compose();
const app = modules.components.app();
document.getElementById('app').append(app);
