const path = require('path');
const process = require('process');
const testTarget = require('../src/main');
const testFiles = process.argv.slice(2);
const testModules = testFiles.map(f => require(path.resolve(f)));
testModules.forEach(run => run(testTarget));
