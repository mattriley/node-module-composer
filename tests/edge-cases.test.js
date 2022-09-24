const composer = require('../');

class Class {
    constructor() {
        throw new Error('Unexpected invocation');
    }
}

const nonPlainObjects = {
    num: 1,
    str: 'str',
    bool: true,
    regex: /abc/,
    arr: [],
    arrOfObj: [{ foo: 'bar' }],
    Class,
    null: null,
    undef: undefined
};

module.exports = ({ test }) => {

    test('standard non-arrow functions are not invoked', t => {
        const target = {
            mod: {
                fun: function () { t.fail('Unexpected invocation'); }
            }
        };
        const { compose } = composer(target);
        const { mod } = compose('mod');
        t.is(mod.fun, target.mod.fun);
    });

    test('non-plain-objects are returned as-is', t => {
        const target = {
            mod1: {
                modA: nonPlainObjects,
                ...nonPlainObjects
            },
            ...nonPlainObjects
        };
        const { compose } = composer(target);
        const { mod1 } = compose.deep('mod1');
        t.equal(mod1.modA, nonPlainObjects);
    });

};
