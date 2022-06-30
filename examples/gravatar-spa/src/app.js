import md5 from 'blueimp-md5';
import compose from './compose';

const { modules } = compose({ md5 });
document.getElementById('app').append(modules.components.app());
