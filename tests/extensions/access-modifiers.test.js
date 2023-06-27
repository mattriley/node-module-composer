const test = require('node:test');
const assert = require('node:assert/strict');
require('module-composer/extensions/access-modifiers');

module.exports = composer => {

    test('privates are accessible internally without prefix', () => {
        const target = {
            mod: {
                _fun1: () => () => 1,
                fun2: ({ mod }) => () => mod.fun1()
            }
        };
        const { compose } = composer(target, { extensions: ['access-modifiers'] });
        const { mod } = compose('mod');
        assert.deepEqual(mod.fun2(), 1);
    });

    test('privates are are accessible internally deeply without prefix', () => {
        const target = {
            mod: {
                sub: {
                    _fun1: () => () => 1,
                    fun2: ({ mod }) => () => mod.sub.fun1()
                }
            }
        };
        const { compose } = composer(target, { extensions: ['access-modifiers'] });
        const { mod } = compose.deep('mod');
        assert.deepEqual(mod.sub.fun2(), 1);
    });

    test('privates are not accessible externally neither with or without prefix', () => {
        const target = {
            mod: {
                _fun1: () => () => 1,
                fun2: () => () => 2
            }
        };
        const { compose } = composer(target, { extensions: ['access-modifiers'] });
        const { mod } = compose('mod');
        assert.deepEqual(mod._fun1, undefined);
        assert.deepEqual(mod.fun1, undefined);
        assert.equal(mod, compose.modules.mod);
    });

    test('accessibility of publics', () => {
        const target = {
            mod: {
                _fun1: () => () => 1,
                fun2: () => () => 2,
                $fun3: () => () => 3
            }
        };
        const { compose } = composer(target, { extensions: ['access-modifiers'] });
        const { mod } = compose('mod');
        assert.deepEqual(mod._fun1, undefined);
        assert.deepEqual(mod.fun1, undefined);
        assert.deepEqual(mod.fun2, undefined);
        assert.deepEqual(typeof mod.fun3, 'function');
        assert.equal(mod, compose.modules.mod);
    });

    test('privates are are accessible internally deeply without prefix when mixed with publics', () => {
        const target = {
            mod: {
                sub: {
                    _fun1: () => () => 1,
                    $fun2: ({ mod }) => () => mod.sub.fun1()
                }
            }
        };
        const { compose } = composer(target, { extensions: ['access-modifiers'] });
        const { mod } = compose.deep('mod');
        assert.deepEqual(mod.sub.fun2(), 1);
    });

    test('when there is a public, the rest are considered private', () => {
        const target = {
            mod: {
                fun1: () => () => 1,
                $fun2: () => () => 2
            }
        };
        const { compose } = composer(target, { extensions: ['access-modifiers'] });
        const { mod } = compose('mod');
        assert.deepEqual(mod.fun1, undefined);
        assert.deepEqual(typeof mod.fun2, 'function');
        assert.equal(mod, compose.modules.mod);
    });

};
