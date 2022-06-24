const isNode = globalThis.process?.release?.name === 'node';
const { performance } = isNode ? require('node:perf_hooks') : window;
module.exports = performance;
