module.exports = ({ test, assert }) => composer => {

    test('submodules are flattened', () => {
        const target = {
            module: {
                mod1: { fun1: () => () => 1 },
                mod2: { fun2: () => () => 2 }
            }
        };
        const { compose } = composer(target);
        const { module } = compose.flat('module', {});
        const { fun1, fun2 } = module;
        assert.deepEqual(fun1(), 1);
        assert.deepEqual(fun2(), 2);
    });

};
