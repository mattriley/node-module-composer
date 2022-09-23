const composer = require('../');

module.exports = ({ test }) => {

    test('privates', t => {
        const target = {
            foo: {
                fun1: () => () => {
                },
                _fun2: () => () => {
                }
            }
        };

        const { compose } = composer(target);
        const { foo } = compose('foo');
        t.notOk(foo._fun2);
        t.notOk(foo.fun2);
        t.notOk(compose.modules.foo._fun2);
        t.notOk(compose.modules.foo.fun2);
    });

};
