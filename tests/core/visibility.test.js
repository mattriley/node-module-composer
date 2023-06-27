const test = require('node:test');
const assert = require('node:assert/strict');

module.exports = composer => {

    test('module can be accessed internally by name', () => {
        const target = {
            mod: {
                fun1: () => () => 1,
                fun2: ({ mod }) => () => mod.fun1()
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        assert.deepEqual(mod.fun2(), 1);
    });

    test('module can be accessed internally using self', () => {
        const target = {
            mod: {
                fun1: () => () => 1,
                fun2: ({ self }) => () => self.fun1()
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        assert.deepEqual(mod.fun2(), 1);
    });

};
