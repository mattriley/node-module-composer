module.exports = ({ test, assert }) => composer => {

    require('module-composer/extensions/access-modifiers');

    test('neither private or public', () => {
        const target = {
            mod: {
                fun1: ({ mod }) => () => mod.fun2(),
                fun2: ({ mod }) => () => mod.sub.fun3(),
                sub: {
                    fun3: ({ mod }) => () => mod.sub.fun4(),
                    fun4: () => () => 1
                }
            }
        };
        const { compose } = composer(target);
        const { mod } = compose.deep('mod', {});
        assert.deepEqual(mod.fun1(), 1);
        assert.notEqual(mod.fun1, undefined);
        assert.notEqual(mod.fun2, undefined);
        assert.notEqual(mod.sub.fun3, undefined);
        assert.notEqual(mod.sub.fun4, undefined);
    });

    test('private', () => {
        const target = {
            mod: {
                fun1: ({ mod }) => () => mod.fun2(),
                _fun2: ({ mod }) => () => mod.sub.fun3(),
                sub: {
                    fun3: ({ mod }) => () => mod.sub.fun4(),
                    _fun4: () => () => 1
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

    test('public', () => {
        const target = {
            mod: {
                $fun1: ({ mod }) => () => mod.fun2(),
                fun2: ({ mod }) => () => mod.sub.fun3(),
                sub: {
                    $fun3: ({ mod }) => () => mod.sub.fun4(),
                    fun4: () => () => 1
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

    test('private and public', () => {
        const target = {
            mod: {
                $fun1: ({ mod }) => () => mod.fun2(),
                _fun2: ({ mod }) => () => mod.sub.fun3(),
                sub: {
                    $fun3: ({ mod }) => () => mod.sub.fun4(),
                    _fun4: () => () => 1
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

    test('private, public and unspecified', () => {
        const target = {
            mod: {
                $fun1: ({ mod }) => () => mod.fun2(),
                _fun2: ({ mod }) => () => mod.fun3(),
                fun3: () => () => 1
            }
        };
        const { compose } = composer(target);
        const { mod } = compose.deep('mod', {});
        assert.deepEqual(mod.fun1(), 1);
        assert.notEqual(mod.fun1, undefined);
        assert.equal(mod.fun2, undefined);
        assert.equal(mod.fun3, undefined);
    });

};
