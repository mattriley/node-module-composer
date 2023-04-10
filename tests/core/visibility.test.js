const composer = require('module-composer');

module.exports = ({ test }) => {

    test('module can be accessed internally by name', t => {
        const target = {
            mod: {
                fun1: () => () => 1,
                fun2: ({ mod }) => () => mod.fun1()
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        t.equal(mod.fun2(), 1);
    });

    test('module can be accessed internally using self', t => {
        const target = {
            mod: {
                fun1: () => () => 1,
                fun2: ({ self }) => () => self.fun1()
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        t.equal(mod.fun2(), 1);
    });

};
