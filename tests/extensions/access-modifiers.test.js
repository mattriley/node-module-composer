module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/access-modifiers');

    test('private and unspecified', () => {
        const target = {
            mod: {
                fun1: ({ mod }) => () => mod.fun2(),
                _fun2: ({ mod }) => () => mod.sub.fun3(),
                sub: {
                    fun3: ({ mod }) => () => mod.sub.fun4(),
                    _fun4: () => () => 1,
                }
            }
        };
        const { compose } = composer(target);
        const { mod } = compose.deep('mod', {});
        assert.deepEqual(mod.fun1(), 1);
        assert.notEqual(mod.fun1, undefined);
        assert.equal(mod.fun2, undefined);
        assert.notEqual(mod.sub.fun3, undefined);
        assert.equal(mod.sub.fun4, undefined);
    });

    test('accessibility of publics', () => {
        const target = {
            mod: {
                _fun1: () => () => 1,
                fun2: () => () => 2,
                $fun3: () => () => 3
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod', {});
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
        const { compose } = composer(target);
        const { mod } = compose.deep('mod', {});
        assert.deepEqual(mod.sub.fun2(), 1);
    });

    test('when there is a public, the rest are considered private', () => {
        const target = {
            mod: {
                fun1: () => () => 1,
                $fun2: () => () => 2
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod', {});
        assert.deepEqual(mod.fun1, undefined);
        assert.deepEqual(typeof mod.fun2, 'function');
        assert.equal(mod, compose.modules.mod);
    });

};
