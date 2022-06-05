import compose from './compose';

const { modules } = compose();
document.getElementById('app').append(modules.components.app());
