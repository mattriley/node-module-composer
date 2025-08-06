class Class {
    constructor() {
        throw new Error('Unexpected invocation');
    }
}

const nonPlainObjects = {
    num: 1,
    str: 'str',
    bool: true,
    // regex: /abc/, // TODO: Review this
    arr: [],
    arrOfObj: [{ foo: 'bar' }],
    // Class,
    null: null,
    undef: undefined
};

module.exports = ({ test, assert }) => composer => {

    // test('standard non-arrow functions are not invoked', () => {
    //     const target = {
    //         mod: {
    //             fun: function () { assert.fail('Unexpected invocation'); }
    //         }
    //     };
    //     const { compose } = composer(target);
    //     const { mod } = compose('mod', {});
    //     assert.equal(mod.fun, target.mod.fun);
    // });

    test('non-plain-objects are returned as-is', () => {
        const target = {
            mod1: {
                sub: nonPlainObjects,
                ...nonPlainObjects
            },
            ...nonPlainObjects
        };
        const { compose } = composer(target);
        const { mod1 } = compose.deep('mod1', {});
        assert.deepEqual(mod1.sub, nonPlainObjects);
    });

};
