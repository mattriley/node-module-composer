const path = require('path');
const process = require('process');
const test = require('node:test');
const assert = require('node:assert/strict');
const testTarget = require('../src/main');
const testFiles = process.argv.slice(2).map(f => path.resolve(f));
const testModules = testFiles.map(f => require(f)({ test, assert }));
testModules.forEach(run => run(testTarget));
