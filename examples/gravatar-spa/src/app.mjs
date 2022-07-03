import compose from './compose.mjs';

const { modules } = compose();
document.getElementById('app').append(modules.components.app());
