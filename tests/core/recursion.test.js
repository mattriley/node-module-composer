const test = require('node:test');
const assert = require('node:assert/strict');

module.exports = composer => {

    test('deps are applied recursively within single module', () => {
        const target = {
            mod1: {
                fun: () => () => 1,
                modA: {
                    fun1: ({ mod1 }) => () => mod1.fun(),
                    fun2: ({ mod1 }) => () => mod1.modA.fun1()
                }
            }
        };
        const { compose } = composer(target);
        const { mod1 } = compose.deep('mod1');
        assert.deepEqual(mod1.modA.fun1(), 1);
        assert.deepEqual(mod1.modA.fun2(), 1);
    });

    test('deps are applied recursively across multiple modules', () => {
        const target = {
            mod1: { modA: { fun: () => () => 1 } },
            mod2: { modB: { fun: ({ mod1 }) => () => mod1.modA.fun() } }
        };
        const { compose } = composer(target);
        const { mod1 } = compose.deep('mod1');
        const { mod2 } = compose.deep('mod2', { mod1 });
        assert.deepEqual(mod2.modB.fun(), 1);
    });

};
