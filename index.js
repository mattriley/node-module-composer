const { compose, collapse } = require('./src');
compose.collapse = (...args) => collapse(compose(...args));
module.exports = compose;
