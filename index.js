const src = require('./src');
const moduleComposition = {};
moduleComposition.collapse = src.moduleComposition.collapse({ moduleComposition });
moduleComposition.compose = src.moduleComposition.compose({ moduleComposition });
module.exports = moduleComposition.compose;
